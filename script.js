const requestURL ="https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

const getJson = async() => {
    return fetch(requestURL).then(response => response.json()).then( data => data)
}
let labels = new Set()
let valueMatrix = {}
const createTable1= async() => {
    let data = await getJson()
    let tbody = document.getElementById('body')
    let i = 1;
    data.forEach(element =>{
        let row = element.events.toString()
        element.events.forEach(act=>{
            labels.add(act)
        })
        let th = document.createElement('th')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let tr = document.createElement('tr')
        th.textContent = i
        td1.textContent = row
        td2.textContent=element.squirrel
        if (element.squirrel){
            tr.style.backgroundColor = 'LightPink'
        }
        tr.appendChild(th)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tbody.appendChild(tr)
        i++
        
    })
    createTable2()
}

const createTable2 = async () =>{
    let data = await getJson()
    let tbody = document.getElementById('correlation')
    let i = 1;
    labels.add('exercise')
    for(let label of labels){
        let temp = {}
        temp['tp']=0
        temp['tn']=0
        temp['fp']=0
        temp['fn']=0
        valueMatrix[label.toString()]=temp
    }
    data.forEach(element=>{

        for(let label of labels){
            if(element.squirrel && element.events.includes(label)){
                valueMatrix[label].tp+=1
            }
            else if(element.events.includes(label)){
                valueMatrix[label].fn+=1
            }
            else if(element.squirrel){
                valueMatrix[label].fp+=1
            }
            else{
                valueMatrix[label].tn+=1
            }
        }
    })
    let correlations = {}
    for(let label of labels){
        let actValue = mcc(valueMatrix[label])
        correlations[label]=actValue
    }

    let items = Object.keys(correlations).map(function(key) {
        return [key, correlations[key]];
    });

    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    
    console.log(items[0][0])
    let j = 1
    for(let i = 0 ; i<items.length ; i++){
        let th = document.createElement('th')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let tr = document.createElement('tr')
        th.textContent = j
        td1.textContent = items[i][0]
        td2.textContent=items[i][1]

        tr.appendChild(th)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tbody.appendChild(tr)
        j++
    }
}


const mcc = ({tp,tn,fp,fn}) =>{
    return (tp*tn - fp*fn)/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn))
}
createTable1()

