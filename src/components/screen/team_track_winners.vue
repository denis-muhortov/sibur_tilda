<script>
import { useGameStore } from '@/stores/interface-interaction.js';
import header_comp from "@/components/header.vue";
import footer_comp from "@/components/footer.vue";
import nomination_item from "@/components/nomination_item.vue";

import gsap from "gsap";

export default {
  name: "team_track_winners",
  data() {
    let interaction = useGameStore();
    return{
        selectedYear: 2022,
        interaction: interaction,
    }
  },
  components:{
    header_comp,
    footer_comp,
    nomination_item,
  },
  methods: {

  },
  mounted() {
    gsap.from(".text-animate-gsap", {
    x: - 100,
    opacity: 0,
    duration: 0.25,
    delay: 0.25,
    ease: "sine",
    });
    gsap.from(".img-animate-gsap", {
    x: - 100,
    opacity: 0,
    scale: 0.5,
    duration: 0.25,
    delay: 0.5,
    ease: "sine",
    });
  },
  computed:{
    availableYears(){
      const uniqueTable = {};
      let years = this.interaction.commandAwards.map(a => a.year).filter((year) =>(!uniqueTable[year] && (uniqueTable[year] = 1)));
      return years.sort((a, b) => b - a);
    },
    yearWinners(){
      return this.interaction.commandAwards.filter(w => w.year == this.selectedYear);
    }
  },
  created(){
    this.selectedYear = this.availableYears[0];
  },
  async beforeRouteEnter(to, from, next){
    let interaction = useGameStore();
    if(!interaction.commandAwards){
        await interaction.loadCommandAwards();
    }
    next();
  }
};
</script>


<template>
  <div class="wrapper">
    <header_comp/>
    <div class="bg-element img-animate-gsap">
      <img src="/img/background_page/team_track_winners.svg" alt=""/>
    </div>
    <div class="wrapper-block">
      <h1 class="title text-animate-gsap">
        Победители командного трека
      </h1>
      <div class="years-container">
        <button class="year"
        v-for="year in availableYears"
        :key="year"

        @click="selectedYear = year"
        :class="{active: selectedYear == year}">
          {{year}}
        </button>
      </div>
      <div class="nomination-container">
        <transition-group name="win_Tracker" appear>
          <nomination_item v-for="item in yearWinners"
            :key="item.id"
            :item = "item"
          />
        </transition-group>
      </div>
    </div>
    <footer_comp/>
  </div>
</template>

<style scoped>




.wrapper{
  width: 100%;
  height: 100%;
}
.wrapper-block{
   width: 1160px;
   height: fit-content;
   margin: 130px 0 0 0;
}

.title{
  font-size: 64px;
  font-weight: 700;
  color: var(--nipigasColorAdditional);
  margin: 75px 0 0 0;
}

.years-container{
  margin: 20px 0 0 0;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
}
.year:first-child{
  margin: 0;
}
.year.active{
  background-color: var(--nipigasColorAdditional);
  color: var(--white);
}
.year{
  margin: 0 0 0 50px;
  width: 115px;
  height: 33px;
  border-radius: 5px;
  border: none;
  background-color: rgba(246, 246, 246, 1);
  color: var(--nipigasColorMain);
  font-size: 20px;
  font-weight: 700;
  transition: all 0.25s ease;
  cursor: pointer;
}
.year:hover{
  background-color: var(--nipigasColorAdditional);
  color: var(--white);
}






.nomination-container{
  margin: 40px 0 300px 0;
  width: 1120px;
  height: fit-content;
  /* flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
  align-items: flex-start; */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  justify-content: space-around;
  gap: 25px;
}






.bg-element{
    position: absolute;
    top: 0;
    width: 1920px;
    height: 1200px;
    z-index: 0;
}
.bg-element img{
    position: absolute;
}




@media (max-width: 1440px) {
  .wrapper-block{
    width: 80vw;
  }
  .title {
    font-size: 3.8vw;
  }
  .nomination-container{
    width: 70vw;
  }
  .nomination-item{
    width: 34vw;
    min-height: 220px;
  }
}
@media (max-width: 1200px) {
  .nomination-item{
    min-height: 200px;
  }
}
@media (max-width: 1024px) {
  .wrapper-block{
    width: 80vw;
  }
  .nomination-container{
    width: 80vw;
    grid-template-columns: 1fr;
  }
  .title {
    margin: 20px 0 0 0;
    font-size: 36px;
    text-align: center;
  }
  .nomination-container{
    flex-direction: column;
  }
  .nomination-item{
    width: 100%;
    min-height: fit-content;
  }
}
@media (max-width: 980px) {

}
@media (max-width: 768px) {

}
@media (max-width: 640px) {

}
@media (max-width: 480px) {
  .years-container{
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .year{
    width: calc(50% - 2vw);
  }
  .year:nth-child(1){
    margin: 0 2vw 10px 0;
  }
  .year:nth-child(2){
    margin: 0 0 10px 2vw;
  }
  .year:nth-child(3){
    margin: 0 2vw 10px 0;
  }
  .year:nth-child(4){
    margin: 0 0 10px 2vw;
  }

  .title {
    font-size: 24px;
    text-align: center;
  }

  .nomination-container{
    margin: 40px 0 50px 0;
  }

}
@media (max-width: 420px) {

}
@media (max-width: 380px) {

}


</style>