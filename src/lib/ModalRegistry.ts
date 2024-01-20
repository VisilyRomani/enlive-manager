import type { ModalComponent } from '@skeletonlabs/skeleton';
import ClientModal from './components/modal/ClientModal.svelte';
import JobModal from './components/modal/JobModal.svelte';
import ScheduleModal from './components/modal/ScheduleModal.svelte';
import EditAddressModal from './components/modal/EditAddressModal.svelte';
import AddAddressModal from './components/modal/AddAddressModal.svelte';
import AddTaskModal from './components/modal/AddTaskModal.svelte';

export const modalRegistry: Record<string, ModalComponent> = {
	ClientModal: { ref: ClientModal },
	JobModal: { ref: JobModal },
	ScheduleModal: { ref: ScheduleModal },
	EditAddressModal: { ref: EditAddressModal },
	AddAddressModal: { ref: AddAddressModal },
	AddTaskModal: { ref: AddTaskModal }
};
