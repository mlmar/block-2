import { HOME_URL } from '../../util/System';
import CLIPBOARD from '../../icons/clipboard.png';

const Clipboard = ({ room }) => {

  const handleCopy = () => {
    const URL = HOME_URL + "/" + room;
   navigator.clipboard.writeText(URL);
  }

  const ClipButton = () => {
    return <span className="flex"> <img src={CLIPBOARD} alt="clipboard"/> </span>
  }

  return (
    <label className="clipboard flex large bold" title="copy room to clipboard" onClick={handleCopy}> {room} <ClipButton/> </label>
  )
}

export default Clipboard;