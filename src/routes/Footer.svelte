<script>
    import { page } from '$app/stores';
     $: isFearPage = $page.url.pathname === '/fear';
    
</script>

<div class="container flex justify-center py-3 text-lg">
    {#if !isFearPage}
    <a href="./fear">
        <button class="py-2 px-6 my-2 bg-yellow-400 rounded-sm font-bold">This can't replace my job!?</button>
    </a>
    {/if}
</div>


<style>

</style>