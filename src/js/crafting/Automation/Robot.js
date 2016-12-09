import { store } from '../../app';
import { has } from '../../crafting';

const Robot = {
    type: 'robot',
    label: 'Robot',
    category: 'automation',
    icon: 'src/icons/robot.svg',
    requires: {
        energy: 300,
        resources: {
            iron: 20,
            silicon: 5
        },
        research: {
            automation: 1
        }
    }
};

export default Robot;
