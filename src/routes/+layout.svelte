<script>
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
    import "../style.css";
</script>

<div class="border-8 mt-1 border-black flex flex-col justify-center align-middle place-content-center place-items-center">
    <Header />
    <slot></slot>
    <Footer />
</div>