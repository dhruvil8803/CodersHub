class ApiFeature{
    constructor(query, regex, category , order,  pageSize, page){
        this.query = query;
        this.regex = regex;
        this.category = category;
        this.order = order;
        this.pageSize = pageSize;
        this.page = page;
    }
    search(){
        this.query = this.query.find(this.regex);
         
        return this;
    }
    filter(){
        this.query = this.query.find(this.category);
        return this;
    }
    tag(e){
        if(e.length === 0) return this;
        this.query = this.query.find({tags : {$all : e}});
        return this;
    }
    sort(){
        this.query = this.query.find().sort(this.order);
        return this;
    }
    pagination(){
        if(this.pageSize === 0) return this;
        this.query = this.query.find().limit(this.pageSize).skip((this.page - 1) * this.pageSize);
        return this;
    }
}
module.exports =  ApiFeature;