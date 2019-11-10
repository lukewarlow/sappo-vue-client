<template>
    <div>
        <toast v-for="(toast, index) in toasts" :key="index" :title="toast.title" :message="toast.message" />
        <div class="container">
            <send-species-message-modal v-if="showModal" @close="showModal = false" :current-username="currentUsername" />
            <div class="card">
                <div class="card-header">
                    Sappo Chat ({{numberOfUniqueSpecies}} unique species of frog)
                </div>
                <div class="card-body chatbox-content">
                    <message-box v-for="(message, index) in messages" :key="index" :current-username="currentUsername" :message="message" />
                </div>
                <div class="card-footer">
                    <div class="input-group">
                        <input class="form-control" v-model="newMessage" />
                        <div class="input-group-append">
                            <button class="btn btn-primary" @click="sendSimpleMessage">Send</button>
                        </div>
                    </div>
                    <br />
                    <div class="input-group">
                        <button class="btn btn-secondary" @click="showModal = true">Send Species</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {emptyMessage, Message, MessagesApi} from "@/api/MessagesApi";
    import {onNewMessage, onUserConnects, onUserDisconnects} from "@/api/Socket";
    import Toast from "@/components/Toast.vue";
    import MessageBox from "@/components/MessageBox.vue";
    import {countNumberOfUniqueSpecies} from "@/UniqueSpeciesCount";
    import SendSpeciesMessageModal from "@/components/SendSpeciesMessageModal.vue";

    @Component({components: {SendSpeciesMessageModal, MessageBox, Toast}})
    export default class ChatBox extends Vue {
        @Prop({type: String, required: true}) readonly currentUsername!: string;

        newMessage: string = "";
        messages: Message[] = [];
        showModal: boolean = false;
        toasts: IToast[] = [];

        get numberOfUniqueSpecies(): number {
            return countNumberOfUniqueSpecies(this.messages);
        }

        async sendSimpleMessage() {
            let message: Message = emptyMessage(this.currentUsername);
            message.content = this.newMessage;
            await MessagesApi.sendMessage(message);
            this.newMessage = "";
        }

        mounted() {
            onUserConnects((user) => {
                if (user != this.currentUsername)
                {
                    this.toasts.push({title: 'User Connected', message: `${user} has connected.`});

                    setTimeout(() => {
                        this.toasts = [];
                    }, 2000);
                }
            });

            onUserDisconnects((user) => {
                this.toasts.push({title: 'User Disconnected', message: `${user} has disconnected.`});

                setTimeout(() => {
                    this.toasts = [];
                }, 2000);
            });

            onNewMessage((message: Message) => {
                this.messages.push(message);
            });

            MessagesApi.retrieveMessages()
                .then(data => {
                    this.messages = data;
                });
        }
    }

    export interface IToast {
        title: string;
        message: string;
    }
</script>

<style lang="css" scoped>
    .chatbox-content {
        height: 600px !important;
        overflow-y: auto;
    }
</style>
