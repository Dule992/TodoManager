declare module 'vite-plugin-istanbul' {
    import { Plugin } from 'vite';
    function istanbul(options: any): Plugin;
    export default istanbul;
}
