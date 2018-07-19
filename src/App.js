import React, { Component } from 'react';
import './App.css';
import localForage from 'localforage/dist/localforage';
import Task from './Task.js';
import Boxs from './Boxs.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      date: new Date(),
      filterSort: 'all',
      namefilter: 'date',
      filterOption: 'all',
      idTask: 0,
      setPriority: false
    };
  };

  componentDidMount() {/*
    this.timerId = setInterval(
      () => this.tick(),
      1000
    );*/
    const self = this;
    localForage.setDriver(localForage.LOCALSTORAGE).then( () => {
      localForage.getItem('arr_save').then( (farr) => {
        if (farr == null) {
          farr = [];
        }
        self.setState({ tasks: farr });
      });
    });
  }

  componentWillUnmount() {
    //clearInterval(this.timerId);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  setTask = (arr) => {
    this.setState({ tasks: arr });
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
    return (tdate);
  };

  add = (text) => {
    this.setState({idTask: this.state.tasks.length}, () =>{
      var arr = this.state.tasks;
      arr.push({text: text, status: false, date: this.setDate(), id: this.state.idTask});
      localForage.setItem('arr_save', arr);
      this.setState({ tasks: arr });
      this.filterTask();
    });   
  };

  deleteBlock = (i) => {
    var arr = this.state.tasks;
    arr.splice(i, 1);
    localForage.setItem('arr_save', arr);
    this.setState({ tasks: arr });
  };

  updateCheck = (i, checked) => {
    var arr = this.state.tasks;
    arr[i].status = checked;
    localForage.setItem('arr_save', arr);
    this.setState({ tasks: arr });
    this.filterTask();

  };

  updateDate = (i, d) => {
    var arr = this.state.tasks;
    arr[i].date = d;
    localForage.setItem('arr_save', arr);
    this.setState({ tasks: arr });
    this.filterTask();
  };

  updateText = (i, text) => {
    var arr = this.state.tasks;
    arr[i].text = text;
    localForage.setItem('arr_save', arr);
    this.setState({ tasks: arr });
    this.filterTask();
  };

  // Сортировка по возрастанию
  sortDFunctionUP = (a, b) => {
    const name = this.state.namefilter;
    if (a[name] === b[name]) {
      return 0;
    }
    else {
      return (a[name] < b[name]) ? -1 : 1;
    }
  }

  // Сортировка по убыванию
  sortDFunctionDOWN = (a, b) => {
    const name = this.state.namefilter;
    if (a[name] === b[name]) {
      return 0;
    }
    else {
      return (a[name] > b[name]) ? -1 : 1;
    }
  }

  // Установка значения для сортировки: по Дате и Статусу 
  setFilterSort = (e) => {
    this.setState({filterSort: e.target.value}, () => {
      this.sortTask();
    });
  }

  // Сортировка по установленеому значению
  sortTask = () => {
    var arr = this.state.tasks;
    switch (this.state.filterSort) {
      case 'dateUP': {
        this.setState({ namefilter: 'date' }, () => this.setState({ tasks: arr.sort(this.sortDFunctionUP) }));
        break;
       }
      case 'dateDOWN': {
        this.setState({ namefilter: 'date' }, () => this.setState({ tasks: arr.sort(this.sortDFunctionDOWN) }));
        break;
      }
      case 'statusFulse': {
        this.setState({ namefilter: 'status' }, () => this.setState({ tasks: arr.sort(this.sortDFunctionUP) }));
        break;
       }
      case 'statusTrue': {
        this.setState({ namefilter: 'status' }, () => this.setState({ tasks: arr.sort(this.sortDFunctionDOWN) }));     
        break;
      }  
      case 'all': {
        this.setState({ namefilter: 'id' }, () => this.setState({ tasks: arr.sort(this.sortDFunctionUP) }));
        break;
      } 
      default:
        break;
    }
  }

  // Поиск по заданиям
  searchText = (e) => {
    const ptext = e.target.value.toLowerCase().trim();
    const self = this;
    if (ptext.length > 0) {
      localForage.getItem('arr_save').then( (farr) => {
        farr = farr.filter( (item, i) => {
          if (item['text'].toLowerCase().search(ptext) !== -1) {
            return true;
          } else {
            return false;
          }
        }
        );
        self.setState({ tasks: farr });
      });      
    } else {
      localForage.getItem('arr_save').then( (farr) => {
        self.setState({ tasks: farr }, () => self.filterTask());
      });
    }
  };

  // Установка значения фильтра: "Все", "Выполненные задание", "Не выполненные задания"
  setFilterOption = (e) => {
    this.setState({filterOption: e.target.value}, () => {
      this.filterTask();
      //() => {this.filterTask(), () => this.sortTask()}
    });
  }

  // Фильтр заданий по установленному значению
  filterTask = () => {
    const self = this;
    switch (this.state.filterOption) {
      case 'vip': {
        localForage.getItem('arr_save').then( (farr) => {
          farr = farr.filter( (item, i) => {
            if (item['status']) {
              return true;
            } else {
              return false;
            }
          }
          );
          self.setState({ tasks: farr }, () => self.sortTask());
        });
        break;
       }
      case 'novip': {
        localForage.getItem('arr_save').then( (farr) => {
          farr = farr.filter( (item, i) => {
            if (item['status'] === false) {
              return true;
            } else {
              return false;
            }
          }
          );
          self.setState({ tasks: farr }, () => self.sortTask());
        });
        break;
      }
      case 'all': {
        localForage.getItem('arr_save').then( (farr) => {
          self.setState({ tasks: farr }, () => self.sortTask());
        });
        break;
      }
      default:
        break;
    }
  };

  checkPriority = () => {
    this.setState({setPriority: !this.state.setPriority});
  };

  SetTaskPriority = (arr) => {
    arr.forEach( (item, i) => {
      item.id = i;
    });
    this.setState({tasks: arr});
    //localForage.setItem('arr_save', arr);
  }

  rendNorm = () => {
    return (
      <div className="field">
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
                <input ref='all' type="radio" name="filterOption" value='all' onChange={this.setFilterOption} defaultChecked={true} />
                <label>Все </label>
                <input ref='vip' type="radio" name="filterOption" value='vip' onChange={this.setFilterOption} />
                <label>Выполнено </label>
                <input ref='novip' type="radio" name="filterOption" value='novip' onChange={this.setFilterOption} />
                <label>Не выполнено </label>
              </td>
            </tr>
            <tr>
              <td id='col1'>
                <label>Сортировка: </label>
              </td>
              <td id='col2'>
                <select ref='pSort' id='pSort' value={this.state.filterSort} onChange={this.setFilterSort}>
                  <option value="all">---</option>
                  <option value="dateUP">Дата (по возрастанию)</option>
                  <option value="dateDOWN">Дата (по убыванию)</option>
                  <option value="statusTrue">Статус: Выполнено</option>
                  <option value="statusFulse">Статус: Не выполнено</option>
                </select>
              </td>
            </tr>
            <tr>
              <td id='col1'>
                <label>Изменить приоритет: </label>
              </td>
              <td id='col2'>
                <input className="l" ref='all' type="checkbox" onChange={this.checkPriority} defaultChecked={this.state.setPriority} />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button onClick={this.add.bind(null, 'Новое задание')} className="btn new">Добавить задание</button>
        {this.state.tasks.map(this.eachTask)}
      </div>
    );
  };

  rendSetPriority = () => {
    return (
      <div className="field">
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
                <input ref='all' type="radio" name="filterOption" value='all' onChange={this.setFilterOption} defaultChecked={true} />
                <label>Все </label>
                <input ref='vip' type="radio" name="filterOption" value='vip' onChange={this.setFilterOption} />
                <label>Выполнено </label>
                <input ref='novip' type="radio" name="filterOption" value='novip' onChange={this.setFilterOption} />
                <label>Не выполнено </label>
              </td>
            </tr>
            <tr>
              <td id='col1'>
                <label>Сортировка: </label>
              </td>
              <td id='col2'>
                <select ref='pSort' id='pSort' value={this.state.filterSort} onChange={this.setFilterSort}>
                  <option value="all">---</option>
                  <option value="dateUP">Дата (по возрастанию)</option>
                  <option value="dateDOWN">Дата (по убыванию)</option>
                  <option value="statusTrue">Статус: Выполнено</option>
                  <option value="statusFulse">Статус: Не выполнено</option>
                </select>
              </td>
            </tr>
            <tr>
              <td id='col1'>
                <label>Изменить приоритет: </label>
              </td>
              <td id='col2'>
                <input className="l" ref='all' type="checkbox" onChange={this.checkPriority} defaultChecked={this.state.setPriority} />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button onClick={this.add.bind(null, 'Новое задание')} className="btn new">Добавить задание</button>
        <Boxs tList={this.state.tasks} SetTaskPriority={this.SetTaskPriority} />
      </div>
    );
  };

  // Перебор задий
  eachTask = (item, i) => {
    return (
      <Task key={ i.toString() + this.getRandomInt(1000).toString() } index={i} update={this.updateText} deleteBlock={this.deleteBlock} updateCheck={this.updateCheck} updateDate={this.updateDate} arrDefaultChecked={item.status} arrDefaultDate={item.date}>
        {item.text}
      </Task>
    );
  };

  render() {
    if (this.state.setPriority) {
      return this.rendSetPriority();
    } else {
      return this.rendNorm();
    }
  }
}
export default App;
