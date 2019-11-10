<template>
    <div class="modal fade show d-block scroll-y" role="dialog" :tabindex="-1">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Send Message</h5>
                </div>
                <div class="modal-body">
                    <div v-if="error" class="alert alert-danger">
                        {{error}}
                    </div>
                    <div v-if="!geolocationAllowed" class="form-group">
                        <button class="btn btn-primary" @click="getLocation">Use Current Location</button>
                    </div>

                    <div class="form-group">
                        <label for="latitude">Latitude</label>
                        <input id="latitude" type="number" class="form-control" :disabled="geolocationAllowed" v-model="message.latitude" />
                    </div>
                    <div class="form-group">
                        <label for="longitude">Longitude</label>
                        <input id="longitude" type="number" class="form-control" :disabled="geolocationAllowed" v-model="message.longitude" />
                    </div>
                    <div class="form-group">
                        <label for="species">Species</label>
                        <input id="species" class="form-control" v-model="message.species" />
                    </div>
                    <div class="form-group">
                        <label for="temperature">Temperature</label>
                        <div class="input-group">
                            <input id="temperature" type="number" class="form-control" v-model="message.temperature" />
                            <div class="input-group-append">
                                <span class="bg-light">°C</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="abundance">Abundance</label>
                        <input id="abundance" type="number" class="form-control" v-model="message.abundance" />
                    </div>
                    <div class="form-group">
                        <label for="content">Content</label>
                        <input id="content" class="form-control" v-model="message.content" />
                    </div>
                    <div class="form-group">
                        <label for="image">Image</label>
                        <input id="image" accept="image/png, image/jpeg" class="form-control-file" type="file" @change="handleImageUpload" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
                    <button class="btn btn-primary" @click="sendMessage">Send</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {MessagesApi, SpeciesMessage} from "@/api/MessagesApi";

    @Component
    export default class SendSpeciesMessageModal extends Vue {
        @Prop({type: String, required: true}) readonly currentUsername!: string;

        geolocationAllowed: boolean = false;
        message: SpeciesMessage = {
            username: this.currentUsername,
            content: "",
            latitude: 0,
            longitude: 0,
            species: "",
            temperature: 25,
            abundance: 1,
            timestamp: new Date(),
            image: ""
        };
        error: string = "";

        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position: Position) => {
                        this.geolocationAllowed = true;
                        this.message.latitude = position.coords.latitude;
                        this.message.longitude = position.coords.longitude;
                    },
                    (error: PositionError) => {
                        this.geolocationAllowed = false;
                        if (error.code === error.PERMISSION_DENIED) {
                            console.log("Geolocation permissions denied");
                        }
                    }
                );
            }
        }

        handleImageUpload(e: any) {
            let files = e.target.files;
            if (files && files.length > 0) {
                let file = files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let base64 = reader.result!!;
                    this.message.image = base64.toString();
                }
            }
        }

        async sendMessage() {
            await MessagesApi.sendMessage(this.message)
                .then(_ => {
                    this.$emit("close");
                })
                .catch(e => {
                    if (e.status === 413) {
                        this.error = "File is too large to upload.";
                    } else {
                        this.error = "Server error";
                    }
                })
        }
    }
</script>

<style lang="css" scoped>
    .scroll-y {
        overflow-y: auto;
    }
</style>
