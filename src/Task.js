import React from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/ru'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

const P = styled.p`
  color: ${props => (props.pColor ? 'green' : 'red')};
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: 5px;
`

const Input = styled.input`
  width: 40px;
  height: 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #5a5a5a;
  outline: none;
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0,0,0, .2);
  transition: 0.5s;
  position: relative;
  &:checked[type="checkbox"] {
  background: #1f8301;
}
&[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 0;
  left: 0;
  background: #fff;
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(0,0,0, .2);
  transition: 0.5s;
}
&:checked[type="checkbox"]::before {
  left: 20px;
}
`

const Textarea = styled.textarea`
  resize: none;
  font-size: 16px;
  background-color: rgb(180, 200, 50);
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  width: 100%;
  height: 80px;
`

const Hr = styled.hr`
  border: 1px solid #aaa719;
  background-color: #d4d37f;
  width: 100%;
`

const Label = styled.label`
  color: green;
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: 5px;
`
const DivBox = styled.div`
  border: 2px solid #aaa719;
  background-color: #d4d37f;
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
`


class Task extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: false,
      checked: this.props.arrDefaultChecked,
      startDate: moment(this.props.arrDefaultDate),
      textareaValue: this.props.children
    }
  }

  // button: Edit
  edit = () => {
    this.setState({ edit: true })
    this.props.handleNotDrag(true)
  }

  // button: Delete
  remove = () => {
    this.props.deleteBlock(this.props.index)
  }

  // button: Save
  save = () => {
    this.props.update(this.props.index, this.state.textareaValue)
    this.setState({ edit: false })
    this.props.handleNotDrag(false)
  }

  // Сhange status of task (checkbox)
  checkState = () => {
    this.setState({ checked: !this.state.checked }, () => {
      this.props.updateCheck(this.props.index, this.state.checked)
    })
  }

  // Сhange date of task
  checkDate = date => {
    //const vDate = e.target.value;
    this.setState({ startDate: date }, () =>
      this.props.updateDate(this.props.index, date)
    )
  }

  handleTextarea = e => {
    this.setState({textareaValue: e.target.value})
  }

  rendNorm = () => {
    var message
    if (this.state.checked) {
      message = 'Выполнено'
    } else {
      message = 'Не выполнено'
    }
    return (
      <DivBox>
        <div>{this.props.children}</div>
        <Hr />
        <Input
          ref="newCheck"
          type="checkbox"
          onChange={this.checkState}
          defaultChecked={this.state.checked}
        />
        <P pColor={this.props.arrDefaultChecked}>Статус: {message}</P>
        <Label>Дата выполнения: </Label>

        <DatePicker
          selected={this.state.startDate}
          onChange={this.checkDate}
          dateFormat="LL"
          todayButton="Сегодня"
        />
        <Hr />
        <button onClick={this.edit} className="btn light">
          Редактировать
        </button>
        <button onClick={this.remove} className="btn red">
          Удалить
        </button>
        <Hr />
        <Label># {this.props.index + 1}</Label>
      </DivBox>
    )
  }

  // Edit mode
  rendEdit = () => {
    return (
      <DivBox>
        <Textarea ref="newTxt" onChange={this.handleTextarea} defaultValue={this.state.textareaValue} />
        <button onClick={this.save} className="btn success">
          Сохранить
        </button>
      </DivBox>
    )
  }

  render() {
    if (this.state.edit) {
      return this.rendEdit()
    } else {
      return this.rendNorm()
    }
  }
}

export {Label, DivBox}
export default Task
