<template>
    <div>
        <top-bar/>
        <div class="container-fluid">
            <template v-if="isLoggedIn">
                <chat-box :current-username="currentUsername"/>
                <button class="btn btn-danger" @click="logout">Logout</button>
            </template>
            <login-or-register @successful-login="successfulLogin" v-else/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TopBar from "@/components/TopBar.vue";
    import ChatBox from "@/components/ChatBox.vue";
    import LoginOrRegister from "@/components/LoginOrRegister.vue";
    import {AccountApi} from "@/api/AccountApi";

    @Component({
        components: {
            ChatBox,
            TopBar,
            LoginOrRegister
        }
    })
    export default class App extends Vue {
        isLoggedIn: boolean = false;
        currentUsername: string = "";

        successfulLogin(username: string) {
            this.currentUsername = username;
            this.isLoggedIn = true;
        }

        async logout() {
            await AccountApi.logout(this.currentUsername)
                .then(async _ => {
                    this.currentUsername = "";
                    this.isLoggedIn = false;
                    if (navigator.credentials && navigator.credentials.preventSilentAccess) {
                        await navigator.credentials.preventSilentAccess();
                    }
                    window.location.reload();
                });
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
