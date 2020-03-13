<template>
    <div>
     <ul>
        <li><a @click="()=>{chatVisibility=true;flowVisibility=false}">Chat</a></li>
        <li><a @click="()=>{flowVisibility=true;chatVisibility=false}">Conversation flow</a></li>
    </ul>

    <v-container class="main_box" v-show="chatVisibility">
        
        <v-layout>
            
            <v-flex >
                <v-card  raised>
                    <v-toolbar color="green" dark >
                        <v-toolbar-title  class="flex">
                            <v-icon>insert_emoticon</v-icon>
                            POV-chatbot
                            
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-container  class="scroll-y"  max-height="600"  id="canvas" >
                        <v-layout column >
                            <v-container v-for="(dialog, index) in dialogs" :key="index"  ma-0 pt-0 pl-0 pr-0 pb-4>
                                <div  class="fade" >
                                    <v-layout align-center >

                                        <v-flex xs2 v-if="dialog.actor=='bot'" >
                                            <v-btn  fab dark small color="green" style="float:right" >
                                                <v-icon medium dark>insert_emoticon</v-icon>
                                            </v-btn>
                                        </v-flex>

                                        <v-flex xs10>

                                            <v-card class="rounded-card" >
                                                <v-card-text >

                                                    <v-container pa0 ma0 style="padding:0px !important;padding-top:10px !important;padding-bottom:10px !important">
                                                        <v-row no-gutters pa0 ma0>
                                                            <v-col pa0 ma0>
                                                                {{dialog.Fulfillment.text}}
                                                                <br/>
                                                                <v-btn  @click="clickButton(button.text)" color="green" class="white--text" small pa0 ma0 v-for="(button, index_button) in dialog.Fulfillment.buttons" :key="index_button">
                                                                    {{button.text}}
                                                                </v-btn>
                                                            </v-col>
                                                         </v-row>
                                                    </v-container>
                                                </v-card-text>
                                            </v-card>

                                        </v-flex>

                                        <v-flex xs2 v-if="dialog.actor!='bot'">
                                            <v-btn  fab dark small color="grey">
                                                <v-icon dark medium >perm_identity</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                    <v-spacer></v-spacer>
                                </div>
                            </v-container>
                        </v-layout>
                    </v-container>
                    
                    <v-divider></v-divider>

                    <v-form v-on:submit.prevent>
                        <v-text-field
                                solo
                                label="Type your message here"
                                append-icon="send"
                                :append-icon-cb="sendMessage"
                                style=" border-bottom: none;outline: none;"
                                v-on:keyup.13="sendMessage()"
                                v-model="labelMessage"
                            >
                        </v-text-field>
                    </v-form>
                </v-card>    
            </v-flex>
        </v-layout>
    </v-container>  




    <v-container class="main_box" v-show="flowVisibility">
         <ul>
        <!-- <li><a @click="()=>{this.numberOfSentences+=1}">Add new sentence</a></li> -->
        <li><a @click="()=>{saveVisibility=true}">Save flow</a></li>
        <li><a @click="()=>{loadVisibility=true}">Load flow</a></li>

    </ul>

        
            <v-form v-on:submit.prevent v-for="(sentence,index) in sentences" :key="index" style="margin-bottom:10px;">
                
<v-card>
    <v-container>
        <v-text-field
                solo
                label="USER TEXT"
                style="clear:both;float:left;margin-right: 20px;margin-bottom:20px"
                v-model="sentences[index].user_text"
            >
        </v-text-field>
        <v-text-field
                solo
                label="BOT TEXT"
                style="float:left;margin-right: 20px"
                v-model="sentences[index].bot_text"
            >
        </v-text-field>
        <v-icon class="add_buttons" color="green" @click="sentences[index].buttons.push({text: ''})">add_to_photos</v-icon>
        <v-icon class="remove_button" color="red" @click="sentences[index].buttons.pop()">remove_circle_outline</v-icon>
        <v-text-field
                v-for="(button, index) in sentences[sentence.id].buttons" :key="index"
                solo
                label="BOT BUTTON TEXT"
                style="clear:both;width:400px;margin-bottom: 10px;"
                v-model="sentences[sentence.id].buttons[index].text" 
            >
        </v-text-field>
                            
    </v-container>
  </v-card>


                
                            
                
            </v-form>
            <v-icon large color="white" class="add_sentences"  @click="addSentence()">add</v-icon>
            <v-icon x-large color="red" class="remove_sentences"  @click="removeSentence()">remove_circle</v-icon>
    </v-container>  

        <div v-show="saveVisibility" id="myModal" class="modal">
            <div  class="modal-content">
                <span @click="() => saveVisibility=false" class="close">&times;</span>
                <div style="margin-top:20px">You need to provide some informations before saving:</div>
                    <v-form v-on:submit.prevent>   
                        <v-text-field
                                solo
                                label="Project name"
                                style="margin-top:20px"
                            >
                        </v-text-field>                
                        <v-btn color="green" style="margin-top:20px;color:white" @click="someMethod()">Save</v-btn>                            
                    </v-form>                
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    const id = Math.random().toString(36).substr(2, 9);
    const actor_types = Object.freeze({
        BOT: "bot",
        USER: "user"
    });
    
    export default {
        name:"Chatbot",
        data:() =>({
            saveVisibility: false,
            loadVisibility: false,
            popupActivo:false,
            sentences: [
                {   
                    id: 0,
                    user_text: "Hej bocie.",
                    bot_text: "Cześć, jestem botem!",
                    buttons: [
                        {
                            text: ""
                        }
                    ]
                },
                {   
                    id: 1,
                    user_text: "",
                    bot_text: "",
                    buttons: [
                        {
                            text: ""
                        }
                    ]
                }
            ],
            chatVisibility: true,
            flowVisibility: false,
            dialogs:[],
            labelMessage: '',
            currentMessage: '',
            debug: null
        }),
        mounted() {
            this.registerDialog(actor_types.BOT,{text: "Beggining from bot."});
        },
        methods:{
            addSentence() {
                const id = this.sentences.length;
                const newSentence = {   
                    id,
                    user_text: "",
                    bot_text: "",
                    buttons: [
                        {
                            text: ""
                        }
                    ]
                }
                this.sentences.push(newSentence);
            },
            removeSentence() {
                this.sentences.pop()
            },
            clickButton: function(buttonText){
                this.registerDialog(actor_types.USER,{text: buttonText});
                setTimeout(() => {
                     this.registerDialog(actor_types.BOT,this.entireDialog[buttonText])
                },900);

            },
            sendMessage: function(){
                this.registerDialog(actor_types.USER,{text: this.labelMessage});
                this.currentMessage = this.labelMessage;
                const sentence = this.getBotMessage();
                setTimeout(() => {
                     this.registerDialog(actor_types.BOT,sentence)
                },900);

                this.labelMessage = "";
            },
            getBotMessage() {
                this.debug = this.sentences
                for(let sentence of this.sentences){
                    this.debug = sentence;
                    if(this.currentMessage === sentence.user_text) {
                        this.debug = sentence;
                        const buttons = sentence.buttons.filter(button => button.text)
                        return {
                            text: sentence.bot_text,
                            buttons
                        };
                    }
                }
            },
            registerDialog(actor,fulfillment){
                const canvas = $("#canvas");
                if(actor===actor_types.BOT){
                    
                    this.dialogs.push({actor:actor,Fulfillment:fulfillment});
                    this.currentMessage = '';

                }else{
                    this.dialogs.push({actor:actor,Fulfillment:fulfillment});
                }

                canvas.animate({scrollTop:canvas.prop('scrollHeight')}, 500, 'swing');
            }
        }
    }
</script>

<style>

    .main_box{

        width:1000px;
        
    }

    .add_buttons {
        margin: 0px 0px 10px 0px;
        border-bottom: none;
        outline: none;
        float: left;
        clear:both;
        border-radius: 50%;
    }
    .remove_button {
        margin: 0px 0px 10px 5px;
        border-bottom: none;
        outline: none;
        float: left;
        
        border-radius: 50%;
    }

    .add_sentences {
        margin: 5px 0px 0px 0px;
        border-bottom: none;
        outline: none;
        float: left;
        clear:both;
        background-color: green;
        border-radius: 50%;
    }
    .remove_sentences {
        margin: 5px 0px 0px 10px;
        border-bottom: none;
        outline: none;
        float: left;
        background-color: white;
        border-radius: 50%;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
        
        
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        
    }

    div.v-text-field__details{
       display: none !important;
       
       
    }
    div.v-input__slot{
        margin-bottom:0px;
        padding:5px;
        
    }

    div.v-text-field{
        padding-top:0px;
        
    }

    .v-input__icon--append .v-icon { 
        color: green;
    }

    .rounded-card{
        
        border-radius:5px;
        
    }

    .fade {
        -webkit-animation: fade 1s;
        animation: fade 1s;
        -moz-animation: fade 1s;
        -o-animation: fade 1s;
        
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: green;
    }

    li {
        float: left;
    }

    li a {
        display: block;
        color: white;
        text-align: center;
        padding: 10px 12px;
        text-decoration: none;
    }

    /* Change the link color to #111 (black) on hover */
    li a:hover {
        background-color: #111;
    }
    @-webkit-keyframes fade {
        0% {opacity: 0.2} 
        50% {opacity: 1}
        
    }

    @-moz-keyframes fade{
        0% {opacity: 0.2} 
        50% {opacity: 1}
    }

    @keyframes fade {
        0% {opacity: 0.2} 
        50% {opacity: 1}
    }

    @-o-keyframes fade {
        0% {opacity: 0.2} 
        50% {opacity: 1}
    }

    #canvas{
        min-height:400px;
        max-height:400px;
    }






/* The Modal (background) */
.modal {
  display:inline-block;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {

  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
