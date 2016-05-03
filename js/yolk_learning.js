import {Observable} from "rx";
import Yolk from 'yolk';

const container = document.getElementById('container');

function App() {
	return (<div>
		Hello world
		</div>)
}

Yolk.render(<App/>, container);