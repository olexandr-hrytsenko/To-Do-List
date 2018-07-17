import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import localforage from 'localforage/dist/localforage';
//import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
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
      pclass: this.props.arrDefaultChecked ? 'pstate_gr' : 'pstate_red',
      dateInput: this.props.arrDefaultDate
    };
  };
  edit = () => {
    this.setState({ edit: true });
  };
  remove = () => {
    this.props.deleteBlock(this.props.index);
  };
  save = () => {
    this.props.update(this.props.index, this.refs.newTxt.value);
    this.setState({ edit: false })
  };
  checkState = () => { //установка статуса: Выполнено / Не выполнено
    
    this.setState({ checked: !this.state.checked }, () => {
      if (this.state.checked) {
        this.setState({ pclass: 'pstate_gr' });
      } else {
        this.setState({ pclass: 'pstate_red' });
      }
      this.props.updateCheck(this.props.index, this.state.checked);
      //console.log (this.props.arrDefaultChecked);
    });
  };
/*
  compocomponentDidMount () {
    this.setState({checked: this.props.arrDefaultChecked});
    this.setState({pclass: this.props.arrDefaultChecked ? 'pstate_gr' : 'pstate_red'});
    this.setState({dateInput: this.props.arrDefaultDate});
  }
*/
  checkDate = (e) => {
    const vDate = e.target.value;
    this.setState({ dateInput: vDate }, () => this.props.updateDate(this.props.index, vDate));
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
        <input ref="dateEnd" type="date" id="date_end" value={this.state.dateInput} onChange={this.checkDate} />
        <hr />
        <button onClick={this.edit} className="btn light">Редактировать</button>
        <button onClick={this.remove} className="btn red">Удалить</button>
        <hr />
        <label># {this.props.index + 1}</label>
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
      return this.rendEdit();
    } else {
      return this.rendNorm();
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      date: new Date(),
      nfilter: 1,
      filterSort: 'all',
      namefilter: 'date',
      filterOption: 'all',
      idTask: 0
    };
  };

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  componentDidMount() {/*
    this.timerId = setInterval(
      () => this.tick(),
      1000
    );*/
    const self = this;
    localforage.setDriver(localforage.LOCALSTORAGE).then(function () {
      localforage.getItem('arr_save', function (err, readValue) {
        if (readValue == null) {
          readValue = [];
        }
        self.setState({ tasks: readValue });
        //console.log("localforage.setDriver");
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
        localforage.setItem('arr_save', arr, function () {
        });
      this.setState({ tasks: arr });
      this.filterTask();
    });   
  };

  deleteBlock = (i) => {
    var arr = this.state.tasks;
    arr.splice(i, 1);
      localforage.setItem('arr_save', arr, function () {
      });
    this.setState({ tasks: arr });
  };

  updateCheck = (i, checked) => {
    var arr = this.state.tasks;
    arr[i].status = checked;
      localforage.setItem('arr_save', arr, function () {
      });
    this.setState({ tasks: arr });
    this.filterTask();

  };

  updateDate = (i, d) => {
    var arr = this.state.tasks;
    arr[i].date = d;
      localforage.setItem('arr_save', arr, function () {
      });
    this.setState({ tasks: arr });
    this.filterTask();
  };

  updateText = (i, text) => {
    var arr = this.state.tasks;
    arr[i].text = text;
      localforage.setItem('arr_save', arr, function () {
      });
    this.setState({ tasks: arr });
    this.filterTask();
  };

  // Сортировка по возростанию
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
        localforage.getItem('arr_save', function (err, readValue) {
          if (readValue == null) {
            readValue = [];
          }
          const farr = readValue.filter(function (item, i) {
            if (item['text'].toLowerCase().search(ptext) !== -1) {
              return true;
            } else {
              return false;
            }
          }
          );
          self.setState({ tasks: farr });
          //console.log( farr );
        });
    } else {
        localforage.getItem('arr_save', function (err, readValue) {
          if (readValue == null) {
            readValue = [];
          }
          self.setState({ tasks: readValue });
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
        localforage.getItem('arr_save', function (err, farr) {
          if (farr == null) {
            farr = [];
          }
          farr = farr.filter(function (item, i) {
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
        localforage.getItem('arr_save', function (err, farr) {
          if (farr == null) {
            farr = [];
          }
          farr = farr.filter(function (item, i) {
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
        localforage.getItem('arr_save', function (err, farr) {
          if (farr == null) {
            farr = [];
          }
          self.setState({ tasks: farr }, () => self.sortTask());
        });
        break;
      }
      default:
        break;
    }
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
//         <p className="tdate">Текущее время: {this.state.date.toLocaleTimeString()}</p>
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
                  <option value="dateUP">Дата (по возростанию)</option>
                  <option value="dateDOWN">Дата (по убыванию)</option>
                  <option value="statusTrue">Статус: Выполнено</option>
                  <option value="statusFulse">Статус: Не выполнено</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button onClick={this.add.bind(null, 'Новое задание')} className="btn new">Добавить задание</button>
        {this.state.tasks.map(this.eachTask)}
      </div>
    );
  }
}
export default App;
