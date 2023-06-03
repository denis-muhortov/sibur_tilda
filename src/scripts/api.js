/*
 * This is the initial API interface
 * we set the base URL for the API
 */

import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_VUE_APP_API_URL + "/api",
  withCredentials: true, // required to handle the CSRF token
});




  /**
   * @typedef {Object} PersonalAwardPayload
   * @property {string} name 
   * @property {string} position
   * @property {string} division
   * @property {string} company 
   * @property {string} award   
   * @property {number} grade   
   * @property {string} issued  
   * @property {File} image   
   * @property {number} year    
   * @property {number} personal_award_section_id 
   */

  /**
   * @typedef {Object} CommandAwardPayload
   * @property {string} nomination 
   * @property {string} description
   * @property {string} authors
   * @property {File} image   
   * @property {number} year    
   */
 


  /**
   * @typedef {Object} PersonalAwardSectionPayload
   * @property {string} title 
   * @property {boolean} issuer_filter
   * @property {boolean} company_filter
   * @property {boolean} grade_filter 
   */


  /**
   * @typedef {Object} PersonalAwardFilter
   * @property {?string} name 
   * @property {?string} companies
   * @property {?string} issuers
   * @property {?numeric} grade 
   * @property {?numeric} year
   * @property {?numeric} personal_award_section_id
   */



export default {



      /**
       * Description
       * @param {PersonalAwardFilter} filter
       * @param {?number} page
       * @returns {any}
       */
      getPersonalAwards(filter, page = 0) {
        for(let prop in filter){
          if(filter[prop] === undefined){
            delete filter[prop];
          }
        }

        let searchParams = new URLSearchParams(filter);
        
        searchParams.append('page', page);

        return apiClient.get("/personal_awards?" + searchParams);
      },




      getPersonalAwardSections() {
        return apiClient.get("/personal_award_sections");
      },
      getCommandAwards() {
        return apiClient.get("/command_awards");
      },

      


      
      /**
       * Description
       * @param {PersonalAwardPayload} data
       * @returns {Promise}
       */
      createPersonalAward(data) {
        let payload = new FormData();
        for(let prop in data){
          payload.append(prop, data[prop]);
        }
        return apiClient.post("/personal_award", payload);
      },
      /**
       * Description
       * @param {number} id
       * @param {PersonalAwardPayload} data
       * @returns {Promise}
       */
      updatePersonalAward(id, data) {
        let payload = new FormData();
        for(let prop in data){
          payload.append(prop, data[prop]);
        }
        return apiClient.put("/personal_award/" + id, payload);
      },

      /**
       * Description
       * @param {number} id
       * @returns {Promise}
       */
      deletePersonalAward(id) {
        return apiClient.delete("/personal_award/" + id);
      },





      /**
       * Description
       * @param {CommandAwardPayload} data
       * @returns {Promise}
       */
      createCommandAward(data) {
        let payload = new FormData();
        for(let prop in data){
          payload.append(prop, data[prop]);
        }
        return apiClient.post("/command_award", payload);
      },
      /**
       * Description
       * @param {number} id
       * @param {CommandAwardPayload} data
       * @returns {Promise}
       */
      updateCommandAward(id, data) {
        let payload = new FormData();
        for(let prop in data){
          payload.append(prop, data[prop]);
        }
        return apiClient.put("/command_award/" + id, payload);
      },

      /**
       * Description
       * @param {number} id
       * @returns {Promise}
       */
      deleteCommandAward(id) {
        return apiClient.delete("/command_award/" + id);
      },




      /**
       * Description
       * @param {PersonalAwardSectionPayload} data
       * @returns {Promise}
       */
      createPersonalAwardSection(data) {
        let payload = new FormData();
        for(let prop in data){
          payload.append(prop, data[prop]);
        }
        return apiClient.post("/personal_award_section", payload);
      },
      /**
       * Description
       * @param {number} id
       * @param {PersonalAwardSectionPayload} data
       * @returns {Promise}
       */
      updatePersonalAwardSection(id, data) {
        let payload = new FormData();
        for(let prop in data){
          payload.append(prop, data[prop]);
        }
        return apiClient.put("/personal_award_section/" + id, payload);
      },

      /**
       * Description
       * @param {number} id
       * @returns {Promise}
       */
      deletePersonalAwardSection(id) {
        return apiClient.delete("/personal_award_section/" + id);
      },




  };