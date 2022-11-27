module.exports = (query)=>{
    let search = {};
    let category = {};
    let sort = {};
    let pageSize = 0;
    let page = 1;
    let tag = [];
    if(query.keyword){
      for(let key in query.keyword) search[key] = {
        $regex : query.keyword[key],
        $options : "i"
       }
    }
    if(query.category){
      for(let key in query.category) category[key] = query.category[key];
    }
    if(query.sort){
      for(let key in query.sort) sort[key] = query.sort[key];
    }
    if(query.tag){
      tag = query.tag;
    }
    if(query.pageSize) pageSize = query.pageSize;
    if(query.page) page = query.page;
    return {search, category, sort,tag,  pageSize, page}
}