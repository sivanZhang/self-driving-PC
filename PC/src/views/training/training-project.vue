<template>
  <div id="training-project">
    <project :trainingProject="trainingProject"  />
  </div>
</template>

<script>
import project from "@/views/overview/project";
import { mapState } from "vuex";
export default {
  name: "training-project",
  components: { project },
  computed:{
    ...mapState("trainingStatus",["trainingProject"])
  },
  created() {
    //this.getTraining();
    this.$store.dispatch("trainingStatus/get_TrainProject")
  }
};
</script>