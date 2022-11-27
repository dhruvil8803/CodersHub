let activity = (activity, title, articleType, desc)=>{
      activity.push({
        title: title,
        articleType : articleType,
        desc : desc,
        date: Date.now()
      })
}

let reputationA = (activity, change, articleType, desc) => {
        activity.push({
            change: change,
             articleType: articleType,
             desc : desc,
             date: Date.now()
        })
}

module.exports = {
    activity, reputationA
}