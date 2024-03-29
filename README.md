# Material for tools evaluation

This repository contains the material used during the evaluation of three tools used for automatic generation and execution of Dialogflow chatbots tests. 



## Table of Contents
- [Structure](#Structure)
- [Chatbots](#Chatbots)
- [Tools](#Tools)
- [Contact](#contact)

## Structure
The repository contains:
- Chatbots: this folder contains the chatbots used for the following study. A folder can contain:
- - backend: this folder exists if the selected chatbot needs a backend to work properly.
- - chatbot: this folder contains the chatbot source files and the chatbot's zip file.
- Coverage results: this folder contains the results got for the RQ2 (intents and entities coverage) calculated by using LogScanner.
- Mutants: this folder contains the mutants generated with MutaBot for each chatbot. 
- report.xlsx: this excel file contains 5 sheets. It was used to keep track of the results of the 3 RQ. 
- Tests: the tests generated by each tool for the specified chatbot.

```bash
.
├── Chatbots
│   ├── Dialogflow
│   │   ├── Currency-converter
│   │   ├── GCalendar-Scheduler
│   │   ├── News
│   │   ├── RoomReservation
│   │   ├── Temperature-converter
│   │   └── Weather-forecast
│   └── Kommunicate
│       └── Ecommerce
├── Coverage_results
│   ├── Botium
│   │   ├── Dialogflow
│   │   └── Kommunicate
│   ├── Charm
│   │   ├── Dialogflow
│   │   └── Kommunicate
│   └── CTG
│       ├── Dialogflow
│       └── Kommunicate
├── Mutants
│   ├── Currency-converter
│   │   ├── chatbot
│   │   └── intent
│   ├── ecommerce
│   │   ├── chatbot
│   │   └── intents
│   ├── GCalendar
│   │   ├── chatbot
│   │   ├── entities
│   │   └── intent
│   ├── News
│   │   ├── chatbot
│   │   ├── entities
│   │   └── intent
│   ├── RoomReservation
│   │   ├── chatbot
│   │   ├── entities
│   │   └── intents
│   ├── Temperature-converter
│   │   ├── chatbot
│   │   ├── entities
│   │   └── intents
│   └── Weather-forecast
│       ├── chatobt
│       └── intents
├── README.md
├── report.xlsx
└── Tests
    ├── Botium
    │   ├── Dialogflow
    │   └── Kommunicate
    ├── Charm
    │   ├── Dialogflow
    │   └── Kommunicate
    └── CTG
        ├── Dialogflow
        └── Kommunicate

```

## Chatbots
Below is a table listing the modified chatbots along with links to their respective source repositories.

| Chatbot Name                                                                                                                                           | Source      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| [E-Commerce](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Kommunicate/Ecommerce)                                | Kommunicate |
| [RoomReservation](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Dialogflow/RoomReservation)                      | Dialogflow  |
| [Weather Forecast](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Dialogflow/Weather-forecast)                    | Dialogflow  |
| [Currency-converter](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Dialogflow/Currency-converter)                | Dialogflow  |
| [Temperature-converter](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Dialogflow/Temperature-converter)          | Dialogflow  |
| [G-Calendar appointment scheduler](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Dialogflow/GCalendar-Scheduler) | Dialogflow  |
| [News](https://github.com/roccograpisarda/material_for_tools_evaluation/tree/main/Chatbots/Dialogflow/News)                                            | Dialogflow  |


## Tools
For the following study the evaluated tools were: 
- [Botium](https://github.com/codeforequity-at/botium-cli): it's a known tool for chatbot testing. 
- [Charm](https://github.com/roccograpisarda/charm-modified): a modified version has been used which did not affect the generation technique, but only the updating of certain functions that used libraries that could no longer be used.
- [CTG](https://gitlab.com/unimib-chatbot-testing/chatbots-tests-generator/-/tree/24.02?ref_type=heads): a modified version of the tool was used, this version, unlike the original one, optimises the retrieval of convo files for each intent and also allows convo files to be imported automatically and specifies the technique to be used to import them.

During the study other tools were used, for example [MutaBot](https://gitlab.com/Michael-Urrico/defectinjector-java) for the RQ3 and [LogScanner](https://github.com/roccograpisarda/LogScanner) for the RQ2.

For all the cases CTG and Botium recovered convo by using the multistepconvos strategy.

## Contact

For questions or clarification feel free to reach out via email:

Name: Rocco Gianni Rapisarda

Email: [r.rapisarda2@campus.unimib.it](mailto:r.rapisarda2@campus.unimib.it)
