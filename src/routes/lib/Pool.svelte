

<script>
    // let dataPool = [
    //     {
    //         text: "I like eating breakfast.",
    //         score: 1
    //     },
    //     {
    //         text: "I like eating lunch.",
    //         score: 1
    //     },
    //     {
    //         text: "I like eating dinner.",
    //         score: 1
    //     },
    //     {
    //         text: "I like eating computers.",
    //         score: 1
    //     },
    //     {
    //         text: "I like eating muffin.",
    //         score: 1
    //     },
    //     {
    //         text: "I like eating pie.",
    //         score: 1
    //     },
    //     {
    //         text: "I like Fighting.",
    //         score: 1
    //     },
    //     {
    //         text: "We had a pie.",
    //         score: 1
    //     },
    //     {
    //         text: "They went to church",
    //         score: 1
    //     },
    //     {
    //         text: "They hate eachother",
    //         score: 1
    //     },
    //     {
    //         text: "Ethiopia is rich",
    //         score: 1
    //     },
    //     {
    //         text: "Ethiopia is poor",
    //         score: 1
    //     },
    //     {
    //         text: "Ethiopia is located in Europe.",
    //         score: 1
    //     },
    //     {
    //         text: "They went to Harvard.",
    //         score: 1
    //     },
    //     {
    //         text: "I like eating pie.",
    //         score: 1
    //     },
    //     {
    //         text: "They hate cats.",
    //         score: 1
    //     }
    // ];
    import {dataPool, trainingData} from '../../Store.js'
    
    let dataPoolValue;
    let trainingDataValue;

    dataPool.subscribe(value => dataPoolValue = value)
    trainingData.subscribe(value => {
        trainingDataValue = value
    })

    // sets the score of each dataPool to 1
    // function scoreToOne(arr){
    //     dataPoolValue = arr.map((ele, i, arr)=>{
    //         return {text: ele.text, score: ele.score = 1}
    //     })
    
    // }

    // scoreToOne(dataPoolValue);

    function addTrainingData(data){
        let index;

        let dataExists = trainingDataValue.find((ele, i)=>{
            index = i;
            return ele.text == data.text;
        })

   
        if(dataExists){
            trainingData.update(value => {
                value[index].score++;
                return value;
            });
        }else{
            trainingData.update(value =>{
                value.push(data);
                return value;
            })
        }
        
     
        }

</script>


<div 


class="pool flex flex-row flex-wrap gap-2 justify-center">
    {#each dataPoolValue as data, i (i)}
        <div class="dataCard border w-fit max-w-[450px] flex flex-grow justify-between px-4 py-2 bg-slate-300 text-lg select-none">
            <h4>{data.text}</h4>
            <button on:click={() => addTrainingData(data)}
                class="rounded-sm  bg-slate-600/70 text-white px-3 mx-3 flex align-middle justify-center">feed</button>
        </div>
    {/each}
</div>
<!-- 
<style>
    .pool{
        border: solid blue 2px;
        display: flex;
        padding: 8px;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    .dataCard{
        width: fit-content;
        max-width: 500px;
        border-radius: 5px;
        background-color: rgba(220, 20, 60, 0.434);
        font-family: sans-serif;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        padding: 0 10px;
        justify-content: space-between;
        align-items: center;
    }
    .dataCard > button{
        border-radius: 0;
        padding: 0 15px;
        margin: 0 0 0 20px;
    }
</style> -->