import type { ModalComponent } from '@skeletonlabs/skeleton';
import ClientModal from './components/modal/ClientModal.svelte';
import JobModal from './components/modal/JobModal.svelte';
import ScheduleModal from './components/modal/ScheduleModal.svelte';
import EditAddressModal from './components/modal/EditAddressModal.svelte';
import AddAddressModal from './components/modal/AddAddressModal.svelte';
import AddTaskModal from './components/modal/AddTaskModal.svelte';
import EditScheduleModal from './components/modal/EditScheduleModal.svelte';
import UpdateScheduleJobModal from './components/modal/UpdateScheduleJobModal.svelte';
import ImportClientModal from './components/modal/ImportClientModal.svelte';
import PaymentModal from './components/modal/PaymentModal.svelte';

export const modalRegistry: Record<string, ModalComponent> = {
	ClientModal: { ref: ClientModal },
	JobModal: { ref: JobModal },
	ScheduleModal: { ref: ScheduleModal },
	EditAddressModal: { ref: EditAddressModal },
	AddAddressModal: { ref: AddAddressModal },
	AddTaskModal: { ref: AddTaskModal },
	EditScheduleModal: { ref: EditScheduleModal },
	UpdateScheduleJobModal: { ref: UpdateScheduleJobModal },
	ImportClientModal: { ref: ImportClientModal },
	PaymentModal: { ref: PaymentModal }
};
