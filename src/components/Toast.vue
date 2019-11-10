<template>
    <div class="position-relative toast-container">
        <div class="toast fade show position-absolute toast-position" role="alert">
            <div class="toast-header">
                <strong>{{title}}</strong>
                <button type="button" class="ml-2 mb-1 close float-right" data-dismiss="toast">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                {{message}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";

    @Component
    export default class Toast extends Vue {
        @Prop({type: String, required: true}) readonly title!: string;
        @Prop({type: String, required: true}) readonly message!: string;
    }
</script>

<style lang="css" scoped>
    .toast-container {
        z-index: 2;
    }

    .toast-position {
        top: 0;
        right: 0;
    }
</style>
