<script lang="ts">
    import { closeModal } from 'svelte-modals';
    import { motion } from '$lib/Stores';

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
</script>

<div
    class="modal"
    role="dialog"
    aria-modal="true"
>
    <button
        class="backdrop"
        on:click={closeModal}
        on:keydown={handleKeydown}
        aria-label="Close modal"
    />
    <div class="content">
        <slot name="title" />
        <slot />
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        transition: opacity var(--motion-duration) ease;
    }

    .content {
        position: relative;
        background: #1c1c1c;
        padding: 1rem;
        border-radius: 8px;
        min-width: 300px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    :global(.modal h1) {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
    }
</style> 