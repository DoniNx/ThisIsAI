<script>
    import { text } from "svelte/internal";
import {trainingData, trainedModelData} from "../../Store.js"
    
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
        else if(event.key == "Enter"){

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








        }
   }
    
   
   $:{
      if(textInput === ""){
        predictedText = "";
      }
   }
</script>


<div class="machine border-[5px] border-gray-500/50 my-3 md:flex md:flex-row sm:flex sm:flex-col max-w-full">
    <div class="dataBucket h-[250px] overflow-scroll flex-grow bottom-8 border-[6.5px] border-yellow-300 rounded-md m-3 select-none">
        
        {#if !trainingDataValue.length}
            <div>Feed data to the model.</div>
        {:else}
            {#each trainingDataValue as sentence}
                <div class="sentenceCard  bg-slate-300 text-lg px-3 py-2 my-2 mx-1 flex flex-row justify-between">
                    <h3>{sentence.text}</h3>
                    <p class="bg-slate-600/70 text-sm text-white font-bold rounded-full h-6 w-6  flex justify-center align-middle self-center place-items-center
                    ">{sentence.score}</p>
                </div>
            {/each}
        {/if}
        
    </div>

    <div class="trainingModel m-4 bg-pink-500/40 rounded-lg flex-grow flex flex-col align-middle justify-center min-h-[180px]">
        <button class="trainModelBtn bg-slate-500 text-white h-fit  w-fit py-1 px-4  rounded-sm self-center font-bold active:bg-yellow-300 active:text-black active:opacity-100   hover:opacity-90 transition ease-in-out  duration-150" on:click={trainModelTrigger}>
            Train Model
        </button>
    </div>
          
    <div class="prediction flex-grow min-h-[180px]">
<input type="text" placeholder="text box..." class="textBox outline-none mt-9 ml-4 px-1 py-1 border-4 w-3/4 border-black" bind:value={textInput} 
                on:keypress={predictionAlgorithmTrigger}> 
       <div class="px-4 mt-4 text-lg">
         <span class="mr-0.5">{textInput}</span>
         <span class="text-gray-500/60">{predictedText}</span>
       </div>
    </div>
</div>

<!-- 
<style>
    
    .machine{
        border: solid red 2px;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        align-items: center;
        justify-content: space-around;

    }
    .dataBucket{
    
        border: solid 2px pink;
        border-radius: 6px;
        width: fit-content;
        height: 200px;
        margin: 10px;
        overflow: scroll;
        flex-grow: 1;
        font-family: sans-serif;

    }
    .trainingModel{
        border: solid 2px rgba(255, 0, 0, 0.016);
        border-radius: 6px;
        background-color: rgba(255, 0, 0, 0.362);
        width: 200px;
        height: 200px;
        margin: 10px;
        display: flex;
        flex-direction: col;
        align-items: center;
        justify-content: center;
        flex-grow: 1;


    }
    .prediction{
        border: solid 2px green;
        width: 200px;
       
        height: 200px;
        margin: 10px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
    }
    .sentenceCard{
        border: dashed 1px black;
        padding: 0px 9px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .trainModelBtn{
        border-radius: 0;
        padding: 2px 11px;
    }
    .textBox{
        margin: 10px auto;
        width: 175px;
    }

    @media only screen and (max-width: 800px) {
   
        .machine{
        border: solid red 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

    }
    .prediction{
        width: 90%;
    }
    .trainingModel{
        width: 90%;
    }
    .dataBucket{
        width: 90%;
    }
}
</style>  -->