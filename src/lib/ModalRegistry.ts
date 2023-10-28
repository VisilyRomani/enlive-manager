import type { ModalComponent } from '@skeletonlabs/skeleton';
import ClientModal from './components/modal/ClientModal.svelte';
import JobModal from './components/modal/JobModal.svelte';

export const modalRegistry: Record<string, ModalComponent> = {
	ClientModal: { ref: ClientModal },
	JobModal: { ref: JobModal }
};
