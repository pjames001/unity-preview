import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaFlag, RiZhihuFill, MdDashboardSharp, BiSearch, BiCalendarDayFill, IoHelpCircleSharp, BiPersonBadge, BiPersonCircle, MdSettings, LaPlaneDepartureSolid, LaToolsSolid, MdKeyboardarrowdown, MdKeyboardarrowup, MdApproval, MdModeltrainingSharp, BiBook, BiCheckAll, MdEmailOutlined, HiTemplate, HiDocumentDuplicate, LaUsersCogSolid, BiTicketPerforated, BiTelephone, BiChatDots, BiPower, SiGmail, BiBell, BiUpload, BiPlusLg, BiThreeDotsVertical, BiFilter, BiXLg, BiX, MdKeyboardarrowleft, MdKeyboardarrowright, BiClockHistory, LaRecycleSolid, MdKeyboarddoublearrowleftRound, MdKeyboarddoublearrowrightRound, BiStar, BiStarFill, BiEye, MdClose, LaCopySolid, HiPhoneIncoming, OiLinkExternal } from "oh-vue-icons/icons";
import App from './App.vue'
import router from './router'

const queryClient = new QueryClient();
const app = createApp(App)

addIcons(FaFlag, RiZhihuFill, MdDashboardSharp, BiSearch, BiCalendarDayFill, IoHelpCircleSharp, BiPersonBadge, BiPersonCircle, MdSettings, LaPlaneDepartureSolid, LaToolsSolid, MdKeyboardarrowdown, MdKeyboardarrowup, MdApproval, MdModeltrainingSharp, BiBook, BiCheckAll, MdEmailOutlined, HiTemplate, HiDocumentDuplicate, LaUsersCogSolid, BiTicketPerforated, BiTelephone, BiChatDots, BiPower, SiGmail, BiBell, BiUpload, BiPlusLg, BiThreeDotsVertical, BiFilter, BiXLg, BiX, MdKeyboardarrowleft, MdKeyboardarrowright, BiClockHistory, LaRecycleSolid, MdKeyboarddoublearrowleftRound, MdKeyboarddoublearrowrightRound, BiStar, BiStarFill, BiEye, MdClose, LaCopySolid, HiPhoneIncoming, OiLinkExternal);

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient });


app.component("v-icon", OhVueIcon);
app.mount('#app')
