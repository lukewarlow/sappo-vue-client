<template>
    <div>
        <div class="form-group">
            <label for="username">Username</label>
            <input class="form-control" id="username" v-model="username" />
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" />
        </div>
        <div v-if="error" class="alert alert-danger">
            {{error}}
        </div>
        <button class="btn btn-primary mr-1" @click="register">Register</button>
        <button class="btn btn-primary" @click="login">Login</button>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {AccountApi} from "@/api/AccountApi";

    @Component
    export default class LoginOrRegister extends Vue {
        username: string = "";
        password: string = "";
        error: string = "";
        auto: boolean = false;

        async register() {
            this.error = "";
            await AccountApi.register(this.username, this.password)
                .then(async _ => {
                    await this.storePasswordCredentials();
                    this.$emit("successful-login", this.username);
                })
                .catch((e: any) => {
                    if (e.status && e.status == 409) {
                        this.error = "Sorry this username is already taken.";
                    } else {
                        this.error = "Server error.";
                    }
                });
        }

        async login() {
            this.error = "";
            await AccountApi.login(this.username, this.password)
                .then(async _ => {
                    if (this.auto) {
                        await this.storePasswordCredentials();
                    }

                    this.$emit("successful-login", this.username);
                })
                .catch((e: any) => {
                    if (e.status) {
                        switch (e.status) {
                            case 401: {
                                this.error = "Incorrect password.";
                                break;
                            }
                            case 404: {
                                this.error = "Username not registered.";
                                break;
                            }
                        }
                    } else {
                        this.error = "Server error.";
                    }
                });
        }

        async storePasswordCredentials() {
            if (navigator.credentials) {
                // @ts-ignore Because the Credentials Management Api is in early days there's not full TypeScript support.
                let cred = new PasswordCredential({
                    id: this.username,
                    password: this.password
                });
                await navigator.credentials.store(cred);
            }
        }

        mounted() {
            if (navigator.credentials) {
                navigator.credentials.get({password: true, mediation: "optional"} as CredentialRequestOptions)
                    .then((cred: Credential | null) => {
                        if (cred) {
                            let username = cred.id;
                            if (cred.type == "password")
                            {
                                let password = (cred as any).password;
                                this.username = username;
                                this.password = password;
                                this.auto = true;
                                this.login();
                            }
                        }

                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }
</script>
