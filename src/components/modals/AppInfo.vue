<template>
  <div>
    <div style="text-align: center">
      <h1 style="margin-bottom: 0">Splitt</h1>
      <p style="margin-top: 0.3em">by <a href="https://jameslittle.me">James Little</a></p>
    </div>

    <hr>

    <div>
      <h3>Feedback</h3>
      <p>This is a very new application. To leave feedback, report a bug, or request a feature please use the form below.</p>
      <p><textarea name="feedback" id="feedback" style="width: 90%; height: 5em;" v-model="feedback"></textarea></p>
      <p><button v-on:click="submitFeedback">Submit</button></p>
    </div>

    <div>
      <h3>Open Source</h3>
      <p>A list of open source libraries used:</p>
      <p><i>Coming soon</i></p>
    </div>
  </div>
</template>

<script>
import Networker from '../../networking';

export default {
  data() {
    return {
      feedback: ""
    };
  },

  methods: {
    submitFeedback: function() {
      Networker.sendFeedback(this.feedback);
    }
  }
};
</script>
