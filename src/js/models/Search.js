import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`); // Masasave lahat ng obj property sa res
            this.result = res.data.recipes; // Ma aaccess mo lahat ng property ng res galing sa API
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}


