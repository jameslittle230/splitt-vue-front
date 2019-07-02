<template>
  <div v-if="this.$store.state.currentGroup">
    <h2>New Split</h2>
    <form action="#" method="post" v-on:submit.prevent="submit"
      v-bind:style="boxStyle"
    >
      <p v-if="active"><button v-on:click="active = false">Never Mind</button></p>
      $
      <VueNumeric
        separator=","
        v-bind:precision="2"
        v-bind:min="0"
        v-bind:max="100000"
        v-model="amount"
        v-on:focus="active = true"
      />

      <div v-if="active">
        <p>
          <label for="memo">
            Memo:
            <input type="text" name="memo" v-model="memo">
          </label>
        </p>

        <input type="radio" id="reimbursement" value="reimbursement" v-model="splitViewModel.type">
        <label for="reimbursement">reimbursement</label>
        <input type="radio" id="split" value="split" v-model="splitViewModel.type">
        <label for="split">split</label>

        <p v-for="(member, idx) in groupMembers" v-bind:key="idx">
          <label>{{member.name}}

            <VueNumeric 
              separator=","
              v-bind:precision="0"
              v-bind:min="0"
              v-bind:max="100"

              v-model="splitViewModel['memberData'][member.email]['percentage']"
            />

            % — ${{ (splitViewModel['memberData'][member.email]['amount'] / 100).toFixed(2) }}
          </label>
        </p>

        <p><button type="submit" v-bind:disabled="percentageSum != 100">
          {{percentageSum == 100 ? "Create Split" : "Percentages must sum to 100%"}}</button></p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import VueNumeric from "vue-numeric";

const a = axios.create({
  baseURL: "http://back.test/api/"
});

export default {
  data() {
    return {
      amount: 0,
      memo: "",
      active: false,
      splitViewModel: {},
    };
  },

  computed: {
    boxStyle: function() {
      return this.active ? {border: `1px dashed black`, padding: `20px`} : {}
    },

    groupMembers: function() {
      if(!this.$store.state.currentGroup) { return null }
      return this.$store.state.currentGroup.members
    },

    percentageSum: function() {
      return Object.keys(this.splitViewModel.memberData)
        .map(k => this.splitViewModel.memberData[k])
        .reduce((a, curr) => a + curr.percentage, 0);
    },

    percentageWatchKey: function() {
      return this.splitViewModel.memberData ? Object.keys(this.splitViewModel.memberData)
        .map(k => this.splitViewModel.memberData[k])
        .reduce((a, curr) => `${a} ${curr.percentage}`, "") : null
    },

    splitNetworkObject: function() {
      const obj = this.splitViewModel.memberData
      const myEmail = this.$store.state.me.email;

      return Object.keys(obj)
        .map(function(k) {
          var out = JSON.parse(JSON.stringify(obj[k]))
          out.user = k
          out.amount = parseFloat(out.amount)
          delete out.percentageManuallySet
          return out
        })
        .filter(o => o.amount > 0)
        .filter(o => o.user != myEmail)
    }
  },

  components: { VueNumeric },

  methods: {
    submit: function() {
      var self = this;
      var currentGroup = this.$store.state.currentGroupId;
      a.request({
        url: `/groups/${currentGroup}/transactions`,
        method: "post",
        data: {
          full_amount: Math.round(this.amount * 100),
          description: this.memo,
          splits: this.splitNetworkObject,
        },
        params: {
          api_token: this.$store.state.apiToken
        }
      })
        .then(function(response) {
          self.$store.commit("addTransaction", response.data);
          self.amount = "";
          self.memo = "";
        })
        .catch(function(error) {
          console.error(error);
        });
    },

    resetSplitViewModel: function() {
      var memberData = {};
      const self = this;
      this.groupMembers.forEach(function(member) {
        memberData[member.email] = {
          amount: 0,
          percentage: 100 / self.groupMembers.length,
          percentageManuallySet: false,
        };
      });

      this.splitViewModel = {
        type: "split",
        memberData: memberData,
      };
    },

    // resetManualSets: function() {
    //   for (const email in this.splitViewModel.memberData) {
    //     if (this.splitViewModel.memberData.hasOwnProperty(email)) {
    //       const element = this.splitViewModel.memberData[email];
    //       // element.amountManuallySet = false;
    //       element.percentageManuallySet = false;
    //     }
    //   }
    // },

    recalculateValues: function() {
      const myEmail = this.$store.state.me.email;
      var totalSoFar = 0;

      for (const email in this.splitViewModel.memberData) {
        if (this.splitViewModel.memberData.hasOwnProperty(email)) {
          const element = this.splitViewModel.memberData[email];
          const amount = Math.floor(Math.round(this.amount * 100) * (element.percentage / 100));
          element.amount = amount;
          totalSoFar += amount;
        }
      }


      var amountLeftOver = this.amount * 100 - totalSoFar
      this.splitViewModel.memberData[myEmail].amount += amountLeftOver;
    },

    resetPercentages: function(type) {
      const percentageOffset = type == "reimbursement" ? 1 : 0
      const myEmail = this.$store.state.me.email;

      for (const email in this.splitViewModel.memberData) {
        if (this.splitViewModel.memberData.hasOwnProperty(email)) {
          const element = this.splitViewModel.memberData[email];
          element.percentage = (type == "reimbursement" && email == myEmail) ? 0 : 100 / (this.groupMembers.length - percentageOffset);
        }
      }
    },
  },

  mounted: function() {
    this.resetSplitViewModel();
  },

  watch: {
    amount: function() {
      this.recalculateValues();
    },

    "splitViewModel.type": function(newVal) {
      this.resetPercentages(newVal)
      this.recalculateValues();
      // this.resetManualSets();
    },

    percentageWatchKey: function() {
      this.recalculateValues();
    },
  }
};
</script>
