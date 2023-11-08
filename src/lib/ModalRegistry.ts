import type { ModalComponent } from '@skeletonlabs/skeleton';
import ClientModal from './components/modal/ClientModal.svelte';
import JobModal from './components/modal/JobModal.svelte';
import ScheduleModal from './components/modal/ScheduleModal.svelte';

export const modalRegistry: Record<string, ModalComponent> = {
	ClientModal: { ref: ClientModal },
	JobModal: { ref: JobModal },
	ScheduleModal: { ref: ScheduleModal }
};
