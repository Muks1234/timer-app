import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import helpers from './helpers';
import uuid from 'uuidv4'

class TimersDashboard extends Component{


    state = {
        timers:[
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid(),
                elapsed: 5456099,
                runningSince: Date.now()
            },
            {
                title:'Bake squash',
                project:'Kitchen Chores',
                id: uuid(),
                elapsed: 1273998,
                runningSince: null,
            }
        ]
    }

    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    createTimer =(timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t)
        });
    }

    handleEditFormSubmit = (attrs) => {
        this.UpdateTimer(attrs);
    }

    handleTrashClick = (timerId) =>{
        this.deleteTimer(timerId);
    }

    UpdateTimer =(attrs) => {
        this.setState({
            timers: this.state.timers.map((timer)=>{
                if(timer.id === attrs.id){
                    return(
                        Object.assign({}, timer, {
                            title: attrs.title,
                            project: attrs.project,
                        })
                    );
                } else{
                    return timer
                }
            })
        })
    };

    handleStartClick = (timerId) => {
        this.startTimer(timerId);
        };

    handleStopClick = (timerId) => {
        this.stopTimer(timerId);
        };

    deleteTimer = (timerId) => {
        this.setState({
            timers: this.state.timers.filter(t => t.id !== timerId),
        });
    };

    startTimer =(timerId) =>{
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map((timer) => {

                if(timer.id === timerId){
                    return(
                        Object.assign({},timer, {runningSince: now})
                    )
                } else{
                    return(
                        timer
                    )
                }
            }),
        });
    };

    stopTimer = (timerId) =>{
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id === timerId){
                    const lastElapsed = now - timer.runningSince;
                    
                    return(
                        Object.assign({}, timer, {
                            elapsed: timer.elapsed + lastElapsed,
                            runningSince: null,
                        })
                    )
                }else{
                    return timer
                }
            }),
        })
    }



    render(){
        
        
        return(
            <div className="heading">
                <h1 id='h1'>Timers</h1>
                <hr id='hr'/>
                <div className='mycontainer'>
                <EditableTimerList 
                timers = {this.state.timers}
                onFormSubmit = {this.handleEditFormSubmit}
                onTrashClick = {this.handleTrashClick}
                onStartClick={this.handleStartClick}
                onStopClick={this.handleStopClick}
                />
                <ToggleableTimerForm 
                onFormSubmit = {this.handleCreateFormSubmit}
                />
            </div>
            </div>
        )
    }
}

class EditableTimerList extends Component{
    render(){

        const timers = this.props.timers.map((timer) => (
            <EditableTimer 

            project = {timer.project}
            id = {timer.id}
            key={timer.id}
            title = {timer.title}
            elapsed = {timer.elapsed}
            runningSince = {timer.runningSince}
            onFormSubmit = {this.props.onFormSubmit}
            onTrashClick={this.props.onTrashClick}
            onStartClick={this.props.onStartClick}
            onStopClick={this.props.onStopClick}
            />
        ));

        return(
            <div id="timers">
            {console.log()}
                {timers}     
            </div>
        );
    }
}

class EditableTimer extends Component{

        state = {
            editFormOpen: false,
        }

        handleEditClick = () =>{
            this.openForm();
        };

        handleFormClose = () => {
            this.closeForm();
        };

        handleSubmit = (timer) => {
            this.props.onFormSubmit(timer);
            this.closeForm();
        };

        closeForm = () => {
            this.setState({editFormOpen: false});
        };

        openForm = () => {
            this.setState({editFormOpen: true});
        };

        

    render(){
        if(this.state.editFormOpen){
        return(
                <TimerForm
                id = {this.props.id}
                title = {this.props.title}
                project = {this.props.project}
                onFormSubmit = {this.handleSubmit}
                onFormClose = {this.handleFormClose}
                />
        );
        } else {
            return (
                <Timer
                id ={this.props.id}
                title={this.props.title}
                project={this.props.project}
                elapsed={this.props.elapsed}
                runningSince={this.props.runningSince}
                onEditClick = {this.handleEditClick}
                onTrashClick = {this.props.onTrashClick}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
                />
            );
        }
    }
}

class TimerForm extends Component{

        state = {
            title: this.props.title || '',
            project: this.props.project || '',
        };

        handleTitleChange = (e) => {
            this.setState({ title: e.target.value });
            };

        handleProjectChange = (e) => {
            this.setState({ project: e.target.value });
            };

        handleSubmit = () =>{
            this.props.onFormSubmit({
                id: this.props.id,
                title: this.state.title,
                project: this.state.project,
            });
        };

    render(){
        const submitText = (this.props.id) ? 'Update' : 'Create';

        return (
            <div className='card' id ="timerform">
                <div className='card-body'>
                    <form>
                        <div className="field">
                            <label style={{fontWeight:600}}>Title</label>
                            <input type ='text' value={this.state.title} className="form-control" onChange={this.handleTitleChange}/>
                        </div>
                        <div className="field">
                            <label style={{fontWeight:600, marginTop: 8}}>Project</label>
                            <input type='text' value={this.state.project} className="form-control" id="project" onChange={this.handleProjectChange}/>
                        </div>
                        <div className='btn-group' id="two-buttons">
                            <button className='btn' id='submitText' onClick={this.handleSubmit}>
                             {submitText}
                            </button>
                            <button className='btn' id='cancel' onClick={this.props.onFormClose}>
                            Cancel
                            </button>
                        </div>
                    </form>
            
            </div>
            </div>
        );
    }
}

class ToggleableTimerForm extends Component{

    state = {
        isOpen: false,
    };

    handleFormOpen = () => {
        this.setState({
            isOpen: true
        })
    };

    handleFormClose = () => {
        this.setState({ isOpen: false})
    };

    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({isOpen: false});
    };

    render(){
        if(this.state.isOpen){
            return(
                <TimerForm
                onFormSubmit={this.handleFormSubmit}
                onFormClose={this.handleFormClose}
                />
            );
        } else{
            return(
                <div className='ui basic content aligned segment' id="plus">
                    <button className='btn' onClick={this.handleFormOpen} id='plusign'>
                    <i className='fa fa-plus'/>
                    </button>
                </div>
            )
        }
    }
}

class Timer extends Component{

    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
        }
    
    componentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
        };

    handleTrashClick = () => {
        this.props.onTrashClick(this.props.id);
    }

    handleStartClick = () => {
        this.props.onStartClick(this.props.id);
        };
    handleStopClick = () => {
        this.props.onStopClick(this.props.id);
        };

    render(){

        const elapsedString = helpers.renderElapsedString(
            this.props.elapsed, this.props.runningSince)
        return(
            <div className='card' id="timer">
                <div className='card-body'>
                    <div className='header'>
                        <h3>{this.props.title}</h3>
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='text-center' id="clock">
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra'>
                        <span 
                        className='float-right'
                        onClick={this.props.onEditClick}
                        >
                            <i className='fa fa-edit'/>
                        </span>
                        <span className='float-right'
                        onClick={this.handleTrashClick}
                        >
                            <i className='fa fa-trash' id ='trash'/>
                        </span>
                    </div>
                </div>  
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                    />
            </div>
        )
    }

}

class TimerActionButton extends Component{
    render(){
        if(this.props.timerIsRunning){
            return(
                <div 
                className = "btn btn-red"
                onClick={this.props.onStopClick}
                >
                    Stop
                </div>
            )
        } else{
            return(
                <div
                className="btn btn-green"
                onClick={this.props.onStartClick}
                >
                    Start
                </div>
            )
        }
    }
}

ReactDOM.render(<TimersDashboard />, document.getElementById('root'));
