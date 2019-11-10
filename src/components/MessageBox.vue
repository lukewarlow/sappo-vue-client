<template>
    <div class="d-inline-block w-100 mb-2">
        <div class="card message-box" :class="{'border-success': isSpeciesMessage, 'bg-success float-right': isOwnMessage, 'bg-light': !isOwnMessage}">
            <!--TODO handle long click for MapModal -->
            <div class="card-body" :title="`${relativeTime} ago`">
                <div class="font-weight-bold">{{message.username}}: {{message.content}}</div>
                <template v-if="isSpeciesMessage">
                    <div>Species: {{(speciesMessage.species)}}</div>
                    <div>Abundance: {{(speciesMessage.abundance)}}</div>
                    <div>Temperature: {{(speciesMessage.temperature)}}°C</div>
                    <img v-if="speciesMessage.image" class="img-fluid" :alt="`${message.username}'s image`" :src="speciesMessage.image" />
                </template>
            </div>
        </div>
        <!--TODO implement MapModal -->
<!--        <map-modal v-if="isSpeciesMessage && showMapModal" />-->
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {isSpeciesMessage, Message, SpeciesMessage} from "@/api/MessagesApi";
    import MapModal from "@/components/MapModal.vue";
    import formatDistanceStrict from "date-fns/formatDistanceStrict";

    @Component
    export default class MessageBox extends Vue {
        @Prop({type: Object, required: true}) readonly message!: Message;
        @Prop({type: String, required: true}) readonly currentUsername!: string;

        showMapModal: boolean = false;

        get isSpeciesMessage(): boolean {
            return isSpeciesMessage(this.message);
        }

        get isOwnMessage(): boolean {
            return this.message.username == this.currentUsername;
        }

        get relativeTime(): string {
            return formatDistanceStrict(new Date(this.message.timestamp), new Date(Date.now()));
        }

        get speciesMessage(): SpeciesMessage {
            return this.message as SpeciesMessage;
        }
    }
</script>

<style lang="css" scoped>
    .message-box {
        max-width: 400px;
        width: fit-content;
    }
</style>
