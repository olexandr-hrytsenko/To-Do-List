import React from 'react';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      checked: this.props.arrDefaultChecked,
      dateInput: this.props.arrDefaultDate
    };
  };





  // режим редактирования (кнопка: Редактировать)
  edit = () => {
    this.setState({ edit: true });
    //this.props.handleNotDrag(true);
  };

  // удаление блока (кнопка: Удалить)
  remove = () => {
    this.props.deleteBlock(this.props.index);
  };

  // сохранение (кнопка: Сохранить)
  save = () => {
    this.props.update(this.props.index, this.refs.newTxt.value);
    this.setState({ edit: false });
    //this.props.handleNotDrag(false);
  };

  // изменение статуса: Выполнено / Не выполнено (checkbox)
  checkState = () => { 
    this.setState({ checked: !this.state.checked }, () => {
      this.props.updateCheck(this.props.index, this.state.checked);
    });
  };

  // изменение даты выполнения
  checkDate = (e) => {
    const vDate = e.target.value;
    this.setState({ dateInput: vDate }, () => this.props.updateDate(this.props.index, vDate));
  };

  // рендер компонента в обычном режиме
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
        <p className={this.props.arrDefaultChecked ? 'pstate_gr' : 'pstate_red'}>Статус: {message}</p>
        <label>Дата выполнения: </label>
        <input ref="dateEnd" type="date" id="date_end" value={this.state.dateInput} onChange={this.checkDate} />
        <hr />
        <button  onClick={this.edit} className="btn light" >Редактировать</button>
        <button onClick={this.remove} className="btn red">Удалить</button>
        <hr />
        <label># {this.props.index + 1}</label>
      </div>
    );
  };

  // рендер компонента в режиме редактирования
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
export default Task;