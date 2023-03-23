<script>
  import {trainingData, trainedModelData} from "../../Store.js"
	import DataBucketInfo from "./descriptions/DataBucketInfo.svelte";
	import MachineInfo from "./descriptions/MachineInfo.svelte";
	import TextBoxInfo from "./descriptions/TextBoxInfo.svelte";

    
    let trainingDataValue;
    let trainedModelDataValue;
    let textInput = "";
    let predictedText = "";
    

    trainingData.subscribe(value => trainingDataValue = value)
    trainedModelData.subscribe(value => trainedModelDataValue = value)


function trainModel({ text: sentence, score: sentenceScore }) {
  let words = sentence.split(" ");
  let previousWord = "";
  words.forEach((currentWord, i, arr) => {
    if (trainedModelDataValue.some((obj) => obj.word == currentWord)) {
      if (previousWord.length !== 0) {
        trainedModelData.update((value) => {
          // updating score on previous word
          const previousIndex = value.findIndex(
            (obj) => obj.word == previousWord
          );
          const currentPossibilityIndex = value[
            previousIndex
          ].nextPossibility.findIndex((obj) => obj.word == currentWord);

          if (currentPossibilityIndex >= 0) {
            // word already exists as next possibility
            const currentPossibility = value[previousIndex].nextPossibility[
              currentPossibilityIndex
            ];
            currentPossibility.score += sentenceScore;
            currentPossibility.score = Math.max(currentPossibility.score, 0);
          } else {
            // add current word as new next possibility
            value[previousIndex].nextPossibility.push({
              word: currentWord,
              score: sentenceScore,
            });
          }
          value[previousIndex].nextPossibility.sort(
            (a, b) => b.score - a.score
          );
          return value;
        });
        previousWord = currentWord;
      } else {
        previousWord = currentWord;
      }
    } else {
      // add new word to the model
      trainedModelData.update((value) => {
        value.push({
          word: currentWord,
          nextPossibility: [],
        });
        return value;
      });
      if (previousWord.length !== 0) {
        trainedModelData.update((value) => {
          // updating score on previous word
          const previousIndex = value.findIndex(
            (obj) => obj.word == previousWord
          );
            value[previousIndex].nextPossibility.push({
              word: currentWord,
              score: sentenceScore,
            });
          
          value[previousIndex].nextPossibility.sort(
            (a, b) => b.score - a.score
          );
          return value;
        });
        previousWord = currentWord;
      } else {
        previousWord = currentWord;
      }
      previousWord = currentWord;
    }
  });
}


   function trainModelTrigger() {
        trainingDataValue.forEach((ele, i, arr) => {
            trainModel(ele);
        });
   }


   function predictionAlgorithm(word, count) {
        let wordIndex = trainedModelDataValue.findIndex((wordData)=> wordData.word == word);
        if(count > 1 || wordIndex === -1) return;

        let nextWord = "";
        
        // algo        
        nextWord = trainedModelDataValue[wordIndex].nextPossibility[0];
       

       if(nextWord != undefined) {
            predictedText = predictedText + " " + nextWord.word;
            predictionAlgorithm(nextWord.word,count+1);
        }
   
        
   }

   function predictionAlgorithmTrigger(event){
        predictedText = "";
       if(event.key == " "){
          let inputWords = textInput.trim().split(" ");
          let inputWord = inputWords.pop();
          let inputWordIndex = trainedModelDataValue.findIndex((wordData)=> wordData.word == inputWord);
          if(inputWord != "" || inputWordIndex !== -1) {
                predictionAlgorithm(inputWord, 0);
          }
        }
        else if(event.key == "." && textInput != ""){

        let index;
        

        let dataExists = trainingDataValue.find((ele, i)=>{
            index = i;
            return ele.text == textInput;
        })

   
        if(dataExists){
            trainingData.update(value => {
                value[index].score++;
                return value;
            });
        }else{
            trainingData.update(value =>{
                value.push({text: textInput.trim(), score: 1});
                return value;
            })
        }  

        //update the trainedData model 
        trainModel(trainingDataValue[trainingDataValue.length-1]);
        textInput = "";


        }
   }
    
   


   let mouseOnBucket = false;
   let mouseOnMachine = false;
   let mouseOnText = false;
   let clientX = 170;
   let clientY = 150;
   
</script>


<div class:dontDisplay={!mouseOnBucket && !mouseOnMachine && !mouseOnText }  style:transform={`translate(${clientX}px, ${clientY}px)`} class="hoverInfogra absolute border-2 border-slate-500 rounded-lg shadow-2xl bg-slate-100 w-52 z-20 px-2 py-1 transition duration-100 ease-in-out">  
  {#if mouseOnBucket}
    <DataBucketInfo />
  {:else if mouseOnMachine}  
    <MachineInfo />
  {:else if mouseOnText}
    <TextBoxInfo />
  {/if}
  </div>


<div class="machine border-[5px] border-gray-500/50 my-3 md:flex md:flex-row sm:flex sm:flex-col max-w-full">
  <div 
    
       on:mousemove={(event)=> {
        
        if(20+event.clientX+192 > window.innerWidth){
          clientX = window.innerWidth-192;
          clientY = event.clientY-20;
        }else{
          clientX = event.clientX+20;
          clientY = event.clientY-20;
        }
        mouseOnBucket = true;
       }}

      on:mouseleave={()=>{ 
        mouseOnBucket = false;
        }}

      class="dataBucket h-[250px] overflow-scroll flex-grow bottom-8 border-[6.5px] border-yellow-300 rounded-md m-3 select-none flex flex-col">
        
        {#if !trainingDataValue.length}
            <div class="self-center my-auto">Feed data to the model.</div>
        {:else}
            {#each trainingDataValue as sentence}
                <div class="sentenceCard  bg-slate-300 text-lg px-3 py-2 my-1 mx-1 flex flex-row justify-between">
                    <h3>{sentence.text}</h3>
                    <p class="bg-slate-600/70 text-sm text-white font-bold rounded-full h-6 w-6  flex justify-center align-middle self-center place-items-center
                    ">{sentence.score}</p>
                </div>
            {/each}
        {/if}
        
    </div>

    <div 
    on:mousemove={(event)=> {
        
      if(20+event.clientX+192 > window.innerWidth){
        clientX = window.innerWidth-192;
        clientY = event.clientY-20;
      }else{
        clientX = event.clientX+20;
        clientY = event.clientY-20;
      }
      mouseOnMachine = true;
     }}

    on:mouseleave={()=>{ 
      mouseOnMachine = false;
      }}
    
    class="trainingModel m-4 bg-pink-500/40 rounded-lg flex-grow flex flex-col align-middle justify-center min-h-[180px]">
        <button class="trainModelBtn bg-slate-500 text-white h-fit  w-fit py-1 px-4  rounded-sm self-center font-bold active:bg-yellow-300 active:text-black active:opacity-100   hover:opacity-90 transition ease-in-out  duration-150" on:click={trainModelTrigger}>
            Train Model
        </button>
    </div>
          
    <div 
    on:mousemove={(event)=> {
      
      if(20+event.clientX+192 > window.innerWidth){
        clientX = window.innerWidth-200-(event.clientX/5);
        clientY = event.clientY-20;
      }else{
        clientX = event.clientX+20;
        clientY = event.clientY-20;
      }
      mouseOnText = true;
     }}

    on:mouseleave={()=>{ 
      mouseOnText = false;
      }}
    class="prediction flex-grow min-h-[180px]">
<input type="text" placeholder="text box..." class="textBox outline-none mt-9 ml-4 px-1 py-1 border-4 w-3/4 border-black" bind:value={textInput} 
                on:keypress={predictionAlgorithmTrigger}> 
       <div class="px-4 mt-4 text-lg">
         <span class="mr-0.5">{textInput}</span>
         <span class="text-gray-500/60">{predictedText}</span>
       </div>
    </div>
</div>


<style>
  .dontDisplay{
    display: none;
  }
</style>