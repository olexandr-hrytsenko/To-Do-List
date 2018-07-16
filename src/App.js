import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import localforage from 'localforage/dist/localforage';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

/*
const SortableItem = SortableElement(({value}) =>
  <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
  state = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}
*/

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    edit: false,
    checked: this.props.arrDefaultChecked,
    pclass: this.props.arrDefaultChecked? 'pstate_gr' : 'pstate_red',
    dateInput: this.props.arrDefaultDate
    };
  };


  edit = () => {
    this.setState ({edit: true});
  };
  remove = () => {
    this.props.deleteBlock (this.props.index);
  };
  save = () => {
    this.props.update (this.props.index, this.refs.newTxt.value);
    this.setState ({edit: false})
  };
  checkState = () => {
    this.setState({checked: !this.state.checked});
    if (this.state.checked) {
      this.setState({pclass:'pstate_red'});
    } else {
      this.setState({pclass:'pstate_gr'});
    }
    this.props.updateCheck (this.props.index, !this.state.checked);
  };

  checkDate = () => {
    this.setState({dateInput: this.refs.dateEnd.value});
    this.props.updateDate (this.props.index, this.refs.dateEnd.value);
  };

  rendNorm = () => {
    var message;
    if (this.state.checked) {
      message = 'Выполнено';
    } else {
      message = 'Не выполнено';
    };

    return (
    <div className="box">
      <div className="text">{this.props.children}</div>
      <hr />


      <input ref="newCheck" type="checkbox" onChange={this.checkState} defaultChecked={this.state.checked} />
      <p className={this.state.pclass}>Статус: {message}</p>

      <label>Дата выполнения: </label>
      <input ref="dateEnd" type="date" id="date_end" value={this.state.dateInput}  onChange={this.checkDate} />
      <hr />

      <button onClick={this.edit} className="btn light">Редактировать</button>
      <button onClick={this.remove} className="btn red">Удалить</button>
      <hr />
      <label># {this.props.index+1}</label>
    </div>
    );
  };
  rendEdit = () => {
    return (
    <div className="box">
      <textarea ref="newTxt" defaultValue={this.props.children}></textarea>
      <button onClick={this.save} className="btn success">Сохранить</button>
    </div>
    );
    };
  render() {
    if (this.state.edit) {
      return this.rendEdit ();
      } else {
      return this.rendNorm ();
      }
    }
  }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      date: new Date(),
      nfilter: 1
    };
  };


  componentDidMount() {
    this.timerId = setInterval(
      ()=> this.tick(),
      1000
    );
    const self = this;
    localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
              localforage.getItem('arr_save', function(err, readValue) {
                if (readValue == null) {
                  readValue = [];
                }
                self.setState ({tasks: readValue});
              });
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  setTask = (arr) => {
      this.setState ({tasks: arr});
  };


  setDate = () => {
    var d = new Date();
    var dd = d.getDate().toString();
    var mm = d.getMonth();
    mm++;
    mm.toString();
    mm = (mm.length === 2) ? mm : '0' + mm;
    var yyyy = d.getFullYear().toString();
    var tdate = yyyy.concat('-', mm, '-', dd);
    //alert(tdate.toString());
    return (tdate);
  };

  add = (text) => {
    var arr = this.state.tasks;
    arr.push ([text, false, this.setDate()]);
    localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
            localforage.setItem('arr_save', arr, function() {
            });
    });
    this.setState ({tasks: arr});
  };

  deleteBlock = (i) => {
    var arr = this.state.tasks;
    arr.splice (i, 1);
    localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
            localforage.setItem('arr_save', arr, function() {
            });
    });
    this.setState ({tasks: arr});
  };

  updateCheck = (i, checked) =>{
    var arr = this.state.tasks;
    arr[i][1] = checked;
    localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
            localforage.setItem('arr_save', arr, function() {
            });
    });
    this.setState ({tasks: arr});

  };

  updateDate = (i, d) =>{
    var arr = this.state.tasks;
    arr[i][2] = d;
    localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
            localforage.setItem('arr_save', arr, function() {
            });
    });
    this.setState ({tasks: arr});

  };
  updateText = (i, text) => {
    var arr = this.state.tasks;
    arr[i][0] = text;
    localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
            localforage.setItem('arr_save', arr, function() {
            });
    });
    this.setState ({tasks: arr});
  };
////

sortDFunctionUP = (a,b) => {
  if (a[2] === b[2]) {
      return 0;
  }
  else {
      return (a[2] < b[2]) ? -1 : 1;
  }
}
sortDFunctionDOWN = (a,b) => {
  if (a[2] === b[2]) {
      return 0;
  }
  else {
      return (a[2] > b[2]) ? -1 : 1;
  }
}
////
  sortTask = () => {
    const p = this.refs.pSort.value;
    const self = this;
    if (p == 1) {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  self.setState ({tasks: readValue.sort(self.sortDFunctionUP)});
                });
      });

    }else if (p == 2) {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  self.setState ({tasks: readValue.sort(self.sortDFunctionDOWN)});
                });
      });

    }
  }

  searchText = () => {
    const ptext = this.refs.pSearch.value.toLowerCase().trim();
    const self = this;
    if (ptext.length > 0) {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  const farr = readValue.filter(function (item, i) {
                      if (item[0].toLowerCase().search(ptext) !== -1){
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  self.setState ({tasks: farr});
                });
      });
    } else {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  self.setState ({tasks: readValue});
                });
      });
    }
  };


  filterTask = () => {
    const self = this;
    if (this.refs.vip.checked) {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  const farr = readValue.filter(function (item, i) {
                      if (item[1]){
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  self.setState ({tasks: farr});
                });
      });
    } else if (this.refs.novip.checked) {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  const farr = readValue.filter(function (item, i) {
                      if (item[1] === false){
                        return true;
                      } else {
                        return false;
                      }
                    }
                  );
                  self.setState ({tasks: farr});
                });
      });
    } else {
      localforage.setDriver(localforage.LOCALSTORAGE).then(function() {
                localforage.getItem('arr_save', function(err, readValue) {
                  if (readValue == null) {
                    readValue = [];
                  }
                  self.setState ({tasks: readValue});
                });
      });
    }
  };


  eachTask = (item, i) => {
    return (
      <Task key={i} index={i} update={this.updateText} deleteBlock={this.deleteBlock} updateCheck={this.updateCheck} updateDate={this.updateDate} arrDefaultChecked={item[1]} arrDefaultDate={item[2]}>
        {item[0]}
      </Task>
    );
  };
  render() {
    return (
      <div className="field">


      <p className="tdate">Текущее время: {this.state.date.toLocaleTimeString()}</p>
      <p className="tdate">Сегодня: {this.state.date.toLocaleDateString()}</p>

        <table>
        <tbody>
          <tr>
            <td id='col1'>
              <label>Поиск: </label>
            </td>
            <td id='col2'>

              <input type="search" ref="pSearch" id="pSearch" onChange={this.searchText} />

            </td>
          </tr>

          <tr>
            <td id='col1'>
              <label>Фильтр: </label>
            </td>
            <td id='col2'>

              <input ref='vse' type="radio" name="radio1" onChange={this.filterTask} defaultChecked={true} />
              <label>Все </label>
              <input ref='vip' type="radio" name="radio1" onChange={this.filterTask} />
              <label>Выполнено </label>
              <input ref='novip' type="radio" name="radio1" onChange={this.filterTask} />
              <label>Не выполнено </label>

            </td>
          </tr>
          <tr>
            <td id='col1'>
              <label>Сортировка: </label>
              
            </td>
            <td id='col2'>

              <select ref='pSort' id='pSort' onChange={this.sortTask}>
                <option value="0">---</option>
                <option value="1">Дата (по возростанию)</option>
                <option value="2">Дата (по убыванию)</option>
                <option value="3">Статус: Выполнено</option>
                <option value="4">Статус: Не выполнено</option>
              </select>

            </td>
          </tr>


          </tbody>
        </table>
        <br />


        <button onClick={this.add.bind (null, 'Новое задание')} className="btn new">Добавить задание</button>
        {this.state.tasks.map (this.eachTask)}
      </div>
    );
  }
}

export default App;
