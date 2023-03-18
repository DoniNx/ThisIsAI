import { writable } from "svelte/store";


export const trainingData = writable([
    
]);     
export const dataPool = writable([
    {
        text: "I like eating breakfast",
        score: 1
    },
    {
        text: "I like eating lunch",
        score: 1
    },
    {
        text: "I like eating dinner",
        score: 1
    },
    {
        text: "I like eating computers",
        score: 1
    },
    {
        text: "I like eating muffin",
        score: 1
    },
    {
        text: "I like eating pie",
        score: 1
    },
    {
        text: "I like fighting",
        score: 1
    },
    {
        text: "We had a pie",
        score: 1
    },
    {
        text: "They went to church",
        score: 1
    },
    {
        text: "They hate eachother",
        score: 1
    },
    {
        text: "England is rich",
        score: 1
    },
    {
        text: "England is poor",
        score: 1
    },
    {
        text: "England is located in Europe",
        score: 1
    },
    {
        text: "They went to Harvard",
        score: 1
    },
    {
        text: "I like eating pie",
        score: 1
    },
    {
        text: "They hate cats",
        score: 1
    },{
        text: "They hate crisis",
        score: 1
    }
]);     
export const trainedModelData = writable([
]);
//; {
//     word: "I",
//     nextPossibility: [
//         {
//             word: "like",
//             score: 0,
//         },
//         {
//             word: "hate",
//             score: 0,
//         },
//         {
//             word: "love",
//             score: 0,
//         }
//     ]
// },
// {
//     word: "like",
//     nextPossibility:[
//         {
//             word: "eating",
//             score: 0
//         },
//         {
//             word: "sleeping",
//             score: 0
//        },
//        {
//             word: "fighting",
//             score: 0
//        }
//     ]
// }
