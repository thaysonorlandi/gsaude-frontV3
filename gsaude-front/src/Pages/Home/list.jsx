
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import { CalendarMonth } from '@mui/icons-material';


function ListComponent() {
  return (
    <>
      <List>
          <ListItem key={1} disablePadding>
          <ListItemButton className='list-button'>
              <ListItemIcon>
              <CalendarMonth />
              </ListItemIcon>
              <ListItemText primary={"Marcação"} />
          </ListItemButton>
          </ListItem>
      </List>
      <List>
          <ListItem key={1} disablePadding>
          <ListItemButton className='list-button'>
              <ListItemIcon>
              <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Cadastros"} />
          </ListItemButton>
          </ListItem>
      </List>
    </>
  );
}

export default ListComponent;