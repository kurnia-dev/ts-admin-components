import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// PrimeVue
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'remixicon/fonts/remixicon.css';
import CToastService from 'primevue/toastservice';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { Icon } from '@iconify/vue';
import NameContainer from './components/NameContainer.vue';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Menu from 'primevue/menu';
import Checkbox from 'primevue/checkbox';

// Vue Router
import router from './routers';

const app = createApp(App);

// Init PrimeVue and its components
app.use(PrimeVue);
app.use(CToastService);

// Init Vue Router
app.use(router);

app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('Icon', Icon);
app.component('NameContainer', NameContainer);
app.component('MultiSelect', MultiSelect);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Menu', Menu);
app.component('Checkbox', Checkbox);

app.mount('#app');
