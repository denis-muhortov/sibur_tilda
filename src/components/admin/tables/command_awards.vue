<script>
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import { useGameStore, debounce } from '@/stores/interface-interaction.js';

import TextEdit from '../cells/textEdit.vue';
import Command_awards_edit from './command_awards_edit.vue';
// import CheckBoxEdit from '../cells/checkBoxEdit.vue';



const headers = [
  { text: "Id", value: "id", fixed: true, width: 50 },
  { text: "Действия", value: "actions", fixed: true, width: 75 },
  { text: "Номинация", value: "nomination", fixed: true, width: 100 },
  { text: "Название проекта", value: "project", width: 200 },
  { text: "Описание проекта", value: "description", width: 200 },
  { text: "Авторы", value: "authors", width: 200 },
  { text: "Фото", value: "image", width: 300 },
  { text: "Год", value: "year", width: 75 },
]


export default {
  name: "command_awards_table",
  props: {
    search: String
  },
  data() {
    let interaction = useGameStore();
    return {
      interaction: interaction,
      headers: headers,
      editedItem: null,
      onEditDone: null,



    }
  },
  components: {
    Vue3EasyDataTable,
    TextEdit,
    Command_awards_edit
  },
  methods: {
    async createItem(item) {
      try {
        let updateItem = {};

        for (let prop in item) {
          if (prop == 'image') {
            if (item[prop] instanceof File) {
              updateItem[prop] = item[prop];
            } else {
              continue;
            }
          }

          switch (item[prop]) {
            case null:
              updateItem[prop] = "";
              break;
            case true:
              updateItem[prop] = 1;
              break;
            case false:
              updateItem[prop] = 0;
              break;
            default:
              updateItem[prop] = item[prop];
              break;
          }
        }

        let res = await this.interaction.api.createCommandAward(updateItem);
        let newItem = res.data.data;

        this.interaction.commandAwards.unshift(newItem);

        this.$toast.success("Данные добавлены");

        return newItem;

      } catch (e) {
        this.$toast.error(e.message);
      }


    },
    async updateItem(item) {

      let oldItem = this.items.find(i => i.id == item.id);
      let oldItemRestore = Object.assign({}, oldItem);
      try {

        let updateItem = {};

        for (let prop in oldItem) {
          if (prop == 'image') {
            if (item[prop] instanceof File) {
              updateItem[prop] = item[prop];
            } else {
              continue;
            }
          }
          if (oldItem[prop] != item[prop]) {

            switch (item[prop]) {
              case null:
                updateItem[prop] = "";
                break;
              case true:
                updateItem[prop] = 1;
                break;
              case false:
                updateItem[prop] = 0;
                break;
              default:
                updateItem[prop] = item[prop];
                break;
            }



          }
        }


        console.log(updateItem);

        let res = await this.interaction.api.updateCommandAward(item.id, updateItem);
        let newItem = res.data.data;

        Object.assign(oldItem, newItem);

        this.$toast.success("Данные обновлены");

        return oldItem;

      } catch (e) {
        setTimeout(() => {
          let oldIdx = this.interaction.commandAwards.findIndex(i => i.id == item.id);
          this.interaction.commandAwards[oldIdx] = oldItemRestore;
        }, 500);
        this.$toast.error(e.message);
      }


    },
    async updateImage(item, event) {

      let oldItem = this.items.find(i => i.id == item.id);
      let oldItemRestore = Object.assign({}, oldItem);
    try {

      let files = event.target.files || event.dataTransfer.files;
      if (!files.length) return;

      let res = await this.interaction.api.updateCommandAward(item.id, { image: files[0] });
      let newItem = res.data.data;
      Object.assign(oldItem, newItem);

      this.$toast.success("Изображение обновлено");
    } catch (e) {
      setTimeout(() => {
          let oldIdx = this.interaction.commandAwards.findIndex(i => i.id == item.id);
          this.interaction.commandAwards[oldIdx] = oldItemRestore;
        }, 500);
      this.$toast.error(e.message);
    }
    },
    async deleteItem(item) {

      if (!confirm(`Удалить ${item.nomination}?`)) return;


      let oldIdx = this.interaction.commandAwards.findIndex(i => i.id == item.id);
      let oldItem = this.interaction.commandAwards[oldIdx];
      let oldItemRestore = Object.assign({}, oldItem);
      try {

        let res = await this.interaction.api.deleteCommandAward(item.id);

        this.interaction.commandAwards.splice(oldIdx, 1);

        this.$toast.success("Удалено");

      } catch (e) {
        setTimeout(() => {
          this.interaction.commandAwards.splice(oldIdx, 0, oldItemRestore);
        }, 500);
        this.$toast.error(e.message);
      }


    },
    async editItem(item) {
      this.onEditDone = async (item) => {
        let updItem = await this.updateItem(item);
        if(!updItem) return;
        this.editItem(updItem);
      }
      this.editedItem = item;
      this.$refs.editForm?.setItem(item)

    },





    async duplicateItem(item) {
      this.onEditDone = async (item) => {
        let newItem = await this.createItem(item);
        if(!newItem) return;
        this.editItem(newItem);
      }
      this.editedItem = Object.assign({}, item, { id: undefined, image: null });

    },
  },
  created() {
    if (!this.interaction.commandAwards) {
      this.interaction.loadCommandAwards();
    }
  },
  computed: {
    availableSections() {
      return this.interaction.personalSections;
    },
    items: {
      get() {
        return this.interaction.commandAwards ?? [];
      }
    },
    searchValue() {
      return (this.search && this.search != "") ? this.search : undefined;
    },
    imagePath() {
      return function (item) {
        if (item.image) {
          try{
                let url = new URL(item.image);
                return url;
            }catch{
                let url = new URL('files/' + item.image, import.meta.env.VITE_VUE_APP_API_URL);
                return url;
            }
        } else {
            return new URL('storage/default_command.jpg', import.meta.env.VITE_VUE_APP_API_URL);
        }
      }
    },

  },
  watch: {
  },
};
</script>


<template>
  <div class="awards_table">

    
      <Teleport to="body" >
        <transition name="openPage" mode="out-in" appear>
          <Command_awards_edit :item="editedItem" @done="onEditDone" @cancel="editedItem = null" v-if="editedItem" ref="editForm"/>
        </transition>
      </Teleport>

      <div class="control-panel">
        <button class="btn" @click="duplicateItem({nomination: null, description: null, project: null, authors: null, year: (new Date()).getFullYear(), image: null })">
            добавить запись
        </button>
      </div>


    <Vue3EasyDataTable :search-value="searchValue" :headers="headers" :items="items" border-cell
      theme-color="rgb(0, 140, 149)" table-class-name="customize-table" header-text-direction="center"
      body-text-direction="center" buttons-pagination>


      <template #item-nomination="item">
        <TextEdit :item="item" editProp="nomination" @updateItem="updateItem($event)" />
      </template>

      <template #item-description="item">
        <TextEdit :item="item" editProp="description" @updateItem="updateItem($event)" />
      </template>

      <template #item-project="item">
        <TextEdit :item="item" editProp="project" @updateItem="updateItem($event)" />
      </template>

      <template #item-authors="item">
        <TextEdit :item="item" editProp="authors" @updateItem="updateItem($event)" />
      </template>


      <template #item-year="item">
        <TextEdit :item="item" editProp="year" @updateItem="updateItem($event)" />
      </template>



      <template #item-actions="item">
        <div class="actions">
          <button title="Удалить" @click="deleteItem(item)">
            <img src="/src/assets/icons/delete.png" alt="Удалить" class="delete" />
          </button>
          <button title="Редактировать" @click="editItem(item)">
            <img src="/src/assets/icons/edit.png" alt="Редактировать" class="edit" />
          </button>
          <button title="Дублировать" @click="duplicateItem(item)">
            <img src="/src/assets/icons/duplicate.png" alt="Дублировать" class="duplicate" />
          </button>
        </div>
      </template>

      <template #item-image="item">
        <div class="photoDownlouad-box">            
          <div class="input__wrapper">
            <input name="file" accept="image/*" type="file" :id="`input_img_${item.id}`" class="input input__file" multiple="false"
              @change="updateImage(item, $event)">
            <label :for="`input_img_${item.id}`" class="input__file-button">
                <span class="input__file-icon-wrapper">
                  <img class="input__file-icon" src="/download.png" alt="Выбрать файл">
                </span>
                <span class="input__file-button-text">Выберите файл</span>
            </label>
          </div>
          <div class="img-block">
            <img :src="imagePath(item)" :alt="item.name">
          </div>
        </div>
      </template>


    </Vue3EasyDataTable>
  </div>
</template>






<style scoped>

.awards_table{
  width: 100%;
}
.customize-table {
  width: 100%;
  height: 100%;

  --easy-table-border: 1px solid var(--nipigasColorMain);
  --easy-table-row-border: 1px solid var(--nipigasColorMain);

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: var(--nipigasColorMain);
  --easy-table-header-background-color: var(--white);

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: var(--nipigasColorMain);
  --easy-table-body-even-row-background-color: var(--white);

  --easy-table-body-row-font-color: var(--textColorBlack);
  --easy-table-body-row-background-color: var(--white);
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: var(--nipigasColorMain-hover);
  --easy-table-body-row-hover-background-color: var(--white);

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: var(--white);
  --easy-table-footer-font-color: var(--nipigasColorMain);
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;


  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;
  ;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}

textarea {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 50px;
  height: fit-content;
  max-height: 200px;
  padding: 5px;
  color: var(--textColorBlack);
  resize: none;
  border: none;
}

input {
  color: var(--textColorBlack);
}

select {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--white);
  font-size: 16px;
  font-weight: 500;
  color: var(--textColorBlack);
  border: 1px solid var(--nipigasColorMain);
  padding: 5px 10px 5px 10px;
  cursor: pointer;
}

option {
  padding: 5px;
  cursor: pointer;
}



.actions button{
  margin: 0 0 20px 0;
}












.img-block{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 20px 0;
}
.img-block img{
  width: 150px;
  height: auto;
}
.photoDownlouad-box{
  width: 100%;
  padding: 0 0 0 10px;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
}
.input__wrapper {
  width: fit-content;
  position: relative;
  margin: 0px 0px 0px 0px;
}
 
.input__file {
  opacity: 0;
  visibility: hidden;
  position: absolute;
}
 
.input__file-icon-wrapper {
  height: 40px;
  width: 40px;
  margin-right: 5px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  border-right: 1px solid #fff;
}
.input__file-icon-wrapper img{
  width: 20px;
  height: 20px;
}
 
.input__file-button-text {
  line-height: 1;
  margin-top: 1px;
}
 
.input__file-button {
  width: 100%;
  max-width: 290px;
  height: 40px;
  background: #1bbc9b;
  color: #fff;
  padding: 0 5px 0 0;
  font-size: 1.125rem;
  font-weight: 700;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: start;
      -ms-flex-pack: start;
          justify-content: flex-start;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 auto;
}

</style>