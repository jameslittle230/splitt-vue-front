<template>
  <div v-if="this.$store.state.currentGroup">
    <h4>Create a New Split</h4>
    <form v-on:submit.prevent="submit">
      <div class="big-number">
        <span class="big-number-prefix">$</span>
        <VueNumeric
          separator=","
          v-bind:precision="2"
          v-bind:min="0"
          v-bind:max="100000"
          v-model="amount"
          v-on:focus="active = true"
          class="big-number-input"
          type="text"
        />
        <button class="active-button" v-on:click="loseFocus" v-if="active" tabindex="18">&times;</button>
      </div>

      <div v-if="active">
        <div>
          <p>
            <label for="memo">
              Memo:
              <br />
              <input
                type="text"
                name="memo"
                v-model="memo"
                style="font-size: 1.2em; min-width: 40%;"
              />
            </label>
          </p>

          <p>
            <label for="desc">
              <div style="margin-bottom: 0.2em;">
                Description:
                <small>(optional)</small>
              </div>
              <textarea
                name="description"
                v-model="description"
                style="padding: 0.8em; min-width: 40%; height: 5em;"
              />
            </label>
          </p>

          <p>
            <label for="date">
              Date:
              <datepicker v-model="date" name="date" format="D, MMM dd, yyyy"></datepicker>
            </label>
          </p>
        </div>

        <p>
          <!-- <h4>Type</h4> -->

          <input
            type="radio"
            id="reimbursement"
            value="reimbursement"
            v-model="splitViewModel.type"
          />

          <label for="reimbursement">Reimbursement</label>
          <br />

          <input type="radio" id="split" value="split" v-model="splitViewModel.type" />
          <label for="split">Split</label>
        </p>

        <div>
          <!-- <h4>Splits</h4> -->

          <table>
            <thead>
              <th>Group Member</th>
              <th>Percentage</th>
              <th>Amount Owed</th>
            </thead>
            <tbody>
              <tr v-for="(member, idx) in groupMembers" v-bind:key="idx">
                <td>{{member.displayName}}</td>
                <td>
                  <VueNumeric
                    separator=","
                    v-bind:precision="2"
                    v-bind:min="0"
                    v-bind:max="100"
                    v-model="splitViewModel['memberData'][member.email]['percentageString']"
                    v-on:blur="handlePercentageInput(member.email)"
                    output-type="String"
                    style="width: 3.5em"
                    v-bind:class="{manuallySet: splitViewModel['memberData'][member.email]['percentageManuallySet']}"
                  />%
                </td>
                <td
                  v-bind:data-amount="splitViewModel['memberData'][member.email]['amount']"
                >${{ (splitViewModel['memberData'][member.email]['amount'] / 100).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="active">
        <p>
          <button
            type="submit"
            v-bind:disabled="percentageSum != 1"
          >{{percentageSum == 1 ? "Create Split" : "Percentages must sum to 100%"}}</button>
        </p>
        <hr />
      </div>
    </form>
  </div>
</template>

<script>
import Networker from "../networking";
import VueNumeric from "vue-numeric";
import Datepicker from "vuejs-datepicker";

export default {
  data() {
    return {
      amount: 0,
      memo: "",
      description: "",
      date: new Date(),
      active: false,
      splitViewModel: {}
    };
  },

  computed: {
    groupMembers: function() {
      if (!this.$store.state.currentGroup) {
        return null;
      }

      return this.$store.state.currentGroup.members;
    },

    percentageSum: function() {
      var sumSoFar = 0;
      for (const email in this.splitViewModel.memberData) {
        if (this.splitViewModel.memberData.hasOwnProperty(email)) {
          const element = this.splitViewModel.memberData[email];
          sumSoFar += element.percentage;
        }
      }

      return sumSoFar;
    },

    penceAmount: function() {
      return Math.round(this.amount * 100);
    },

    splitNetworkObject: function() {
      const obj = this.splitViewModel.memberData;
      const myEmail = this.$store.state.me.email;

      return Object.keys(obj)
        .map(function(k) {
          var out = JSON.parse(JSON.stringify(obj[k]));
          out.user = k;

          delete out.percentageManuallySet;
          delete out.percentageString;

          return out;
        })
        .filter(o => o.amount > 0)
        .filter(o => o.user != myEmail);
    }
  },

  components: { VueNumeric, Datepicker },

  methods: {
    loseFocus: function() {
      this.amount = 0;
      this.active = false;
      this.memo = "";
      this.description = "";
      this.date = new Date();
      this.resetSplitViewModel();
    },

    submit: function() {
      if (this.penceAmount == 0 || this.memo == "") {
        alert("You need a memo (or you need to make a split that's >$0)");
        return;
      }
      var self = this;
      Networker.createTransactionWithSplits(
        this.penceAmount,
        this.memo,
        this.description,
        this.date,
        this.splitNetworkObject
      )
        .then(function() {
          self.loseFocus();
          self.active = true;
          self.$store.dispatch("refreshDebts");
        })
        .catch(function(error) {
          Networker.log(error);
        });
    },

    resetSplitViewModel: function(type = "split") {
      if (!this.groupMembers) {
        return null;
      }
      var memberData = {};
      this.groupMembers.forEach(function(member) {
        memberData[member.email] = {
          amount: 0,
          percentage: 0,
          percentageManuallySet: false
        };
      });

      this.splitViewModel = {
        type: type,
        memberData: memberData
      };

      this.resetPercentages(type);
      this.recalculateValues();
    },

    recalculateValues: function() {
      if (!this.groupMembers) {
        return null;
      }

      const myEmail = this.$store.state.me.email;
      var sumSoFar = 0;

      for (const email in this.splitViewModel.memberData) {
        if (this.splitViewModel.memberData.hasOwnProperty(email)) {
          const element = this.splitViewModel.memberData[email];
          const splitAmountInPence = Math.floor(
            this.penceAmount * element.percentage
          );
          element.amount = splitAmountInPence;
          sumSoFar += splitAmountInPence;
        }
      }

      var amountLeftOver = this.penceAmount - sumSoFar;
      this.splitViewModel.memberData[myEmail].amount += amountLeftOver;
    },

    resetPercentages: function() {
      const type = this.splitViewModel.type;
      const percentageOffset = type == "reimbursement" ? 1 : 0;
      const myEmail = this.$store.state.me.email;

      var manuallySetPercentageSumSoFar = 0;
      var manuallySetCountSoFar = 0;
      for (const email in this.splitViewModel.memberData) {
        if (this.splitViewModel.memberData.hasOwnProperty(email)) {
          const element = this.splitViewModel.memberData[email];
          if (element.percentageManuallySet) {
            manuallySetPercentageSumSoFar += element.percentage;
            manuallySetCountSoFar++;
          }
        }
      }

      for (const email in this.splitViewModel.memberData) {
        if (this.splitViewModel.memberData.hasOwnProperty(email)) {
          const element = this.splitViewModel.memberData[email];
          if (element.percentageManuallySet) {
            continue;
          }
          element.percentage =
            type == "reimbursement" && email == myEmail
              ? 0
              : (1 - manuallySetPercentageSumSoFar) /
                (this.groupMembers.length -
                  percentageOffset -
                  manuallySetCountSoFar);
          element.percentageString = (element.percentage * 100).toFixed(2);
        }
      }

      if (this.percentageSum < 1) {
        this.splitViewModel.memberData[myEmail].percentage +=
          1 - this.percentageSum;
      }
    },

    handlePercentageInput: function(email) {
      const element = this.splitViewModel.memberData[email];
      if (element.percentageString == (element.percentage * 100).toFixed(2)) {
        return;
      }
      element.percentage = parseFloat(element.percentageString) / 100;
      element.percentageManuallySet = true;
      this.resetPercentages(this.type);
      this.recalculateValues();
    }
  },

  mounted: function() {
    this.resetSplitViewModel("split");
  },

  watch: {
    amount: function() {
      if (!this.groupMembers) {
        return null;
      }
      this.recalculateValues();
    },

    groupMembers: function() {
      if (!this.groupMembers) {
        return null;
      }
      this.resetSplitViewModel("split");
    },

    "splitViewModel.type": function(newVal) {
      if (!this.groupMembers) {
        return null;
      }

      this.resetSplitViewModel(newVal);
    }
  }
};
</script>

<style scoped>
.big-number {
  font-size: 3em;
  background: hsla(0, 0%, 0%, 0.05);
  border-radius: 8px;
  border: 2px solid hsla(0, 0%, 0%, 0.3);
  padding: 0.1em;
  display: flex;
}

.big-number-prefix {
  color: hsla(0, 0%, 0%, 0.5);
  margin-right: 0.2em;
  font-weight: 300;
}

.big-number-input {
  border: none;
  background: none;
  font-size: 1em;
  font-weight: 600;
  padding: 0;
  flex-grow: 1;
}

.active-button {
  background: none;
  border: none;
  color: hsla(0, 0%, 0%, 0.7);
  padding: 0 10px;
}

.manuallySet {
  border-color: red;
}
</style>
