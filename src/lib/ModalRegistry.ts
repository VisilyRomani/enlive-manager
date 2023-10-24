import type { ModalComponent } from '@skeletonlabs/skeleton';
import ClientModal from './components/modal/ClientModal.svelte';

export const modalRegistry: Record<string, ModalComponent> = {
	clientModal: { ref: ClientModal }
};
