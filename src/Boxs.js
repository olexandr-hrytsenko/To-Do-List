import React from 'react'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'
import Task, { Label, DivBox } from './Task.js'
import localForage from 'localforage/dist/localforage'
import styled from 'styled-components'
import moment from 'moment';

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  font-size: 0.7em;
  color: #fff;
  outline: none;
  background-color: #ec6a6a;
  border: 2px solid #ff1212;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 30%;
  width: 40%;
  &:hover {
    background-color: #ec2b11;
    border-color: #c30d0d;
  }
`
const Table = styled.table`
  width: 100%;
  text-align: center;
`
const Td = styled.td`
  vertical-align: middle;
  width: ${props => () =>{
    return props.FirstCol ? '20%' : '80%'} };
  text-align: ${props => props.FirstCol ? 'left' : 'inherit' };
`
const InputSearch = styled.input`
  width: 100%;
`
const DivContainer = styled.div`
  width: 100%;
  margin-left: 0%;
  margin-right: 0%;
`
const Img = styled.img`
  filter: ${props => props.imgDrag ? 'sepia(100%)' : 'sepia(0%)' };
`

var randtoken = require('rand-token')

const DragHandle = SortableHandle(() => {
  return <Img imgDrag={true} src="drag-reorder.png" alt="Drag-list" />
})

const SortableItem = SortableElement(
  ({
    value,
    status,
    date,
    randkey,
    i,
    updateText,
    deleteBlock,
    updateCheck,
    updateDate,
    handleNotDrag
  }) => (
    <DivBox>
      <DragHandle handleNotDrag={handleNotDrag} />
      <Task
        key={randkey}
        index={i}
        update={updateText}
        deleteBlock={deleteBlock}
        updateCheck={updateCheck}
        updateDate={updateDate}
        arrDefaultChecked={status}
        arrDefaultDate={date}
        handleNotDrag={handleNotDrag}
      >
        {value}
      </Task>
    </DivBox>
  )
)

const SortableList = SortableContainer(
  ({
    items,
    updateText,
    deleteBlock,
    updateCheck,
    updateDate,
    handleNotDrag,
    ...other
  }) => {
    return (
      <DivContainer>
        {items.map((item, index) => {
          return (
            <SortableItem
              key={`item-${index}-` + item.randkey}
              index={index}
              value={item.text}
              date={item.date}
              status={item.status}
              id={item.randkey}
              i={index}
              updateText={updateText}
              deleteBlock={deleteBlock}
              updateCheck={updateCheck}
              updateDate={updateDate}
              handleNotDrag={handleNotDrag}
              {...other}
            />
          )
        })}
      </DivContainer>
    )
  }
)

class Boxs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      filterSort: 'all',
      namefilter: 'id',
      filterOption: 'all',
      idTask: 0,
      notDrag: false,
    }
  }

  componentDidMount() {
    const self = this
    localForage.setDriver(localForage.LOCALSTORAGE).then(() => {
      localForage.getItem('arr_save').then(farr => {
        if (farr == null) {
          farr = []
        }
        self.setState({ tasks: farr })
      })
    })
  }
/*
  setDate = () => {
    var d = new Date()
    var dd = d.getDate().toString()
    var mm = d.getMonth()
    mm++
    mm.toString()
    mm = mm.length === 2 ? mm : '0' + mm
    var yyyy = d.getFullYear().toString()
    var tdate = yyyy.concat('-', mm, '-', dd)
    return tdate
  }*/

  save = () => {
    var arr = this.state.tasks
    localForage.setItem('arr_save', arr)
  }

  // Add task
  add = e => {
    this.setState({ idTask: this.state.tasks.length }, () => {
      var arr = [{
        text: 'Новое задание',
        status: false,
        date: moment(),
        id: this.state.idTask ,
        randkey: randtoken.generate(16)
      },
      ...this.state.tasks]
      localForage.setItem('arr_save', arr)
      this.setState({ tasks: arr })
      this.filterTask()
    })
  }

  // Delete task
  deleteBlock = i => {
    var arr = this.state.tasks
    arr.splice(i, 1)
    localForage.setItem('arr_save', arr)
    this.setState({ tasks: arr })
  }

  // Update status of task
  updateCheck = (i, checked) => {
    var arr = this.state.tasks
    arr[i].status = checked
    localForage.setItem('arr_save', arr)
    this.setState({ tasks: arr }, () => this.filterTask())
    //this.filterTask();
  }

  // Update date
  updateDate = (i, d) => {
    var arr = this.state.tasks
    arr[i].date = d
    localForage.setItem('arr_save', arr)
    this.setState({ tasks: arr }, () => this.filterTask())
    //this.filterTask();
  }

  // Update text of task
  updateText = (i, text) => {
    var arr = this.state.tasks
    arr[i].text = text
    localForage.setItem('arr_save', arr)
    this.setState({ tasks: arr }, () => this.filterTask())
    //this.filterTask();
  }

  // Sort ascending
  sortDFunctionUP = (a, b) => {
    const name = this.state.namefilter
    if (a[name] === b[name]) {
      return 0
    } else {
      return a[name] < b[name] ? -1 : 1
    }
  }

  // Sort descendingly
  sortDFunctionDOWN = (a, b) => {
    const name = this.state.namefilter
    if (a[name] === b[name]) {
      return 0
    } else {
      return a[name] > b[name] ? -1 : 1
    }
  }

  // Set the value for sorting: by date, by status
  setFilterSort = e => {
    this.setState({ filterSort: e.target.value }, () => {
      this.sortTask()
    })
  }

  // Sort by set value
  sortTask = () => {
    var arr = this.state.tasks
    switch (this.state.filterSort) {
      case 'dateUP': {
        this.setState({ namefilter: 'date' }, () =>
          this.setState({ tasks: arr.sort(this.sortDFunctionUP) })
        )
        this.setState({ notDrag: true })
        break
      }
      case 'dateDOWN': {
        this.setState({ namefilter: 'date' }, () =>
          this.setState({ tasks: arr.sort(this.sortDFunctionDOWN) })
        )
        this.setState({ notDrag: true })
        break
      }
      case 'statusFulse': {
        this.setState({ namefilter: 'status' }, () =>
          this.setState({ tasks: arr.sort(this.sortDFunctionUP) })
        )
        this.setState({ notDrag: true })
        break
      }
      case 'statusTrue': {
        this.setState({ namefilter: 'status' }, () =>
          this.setState({ tasks: arr.sort(this.sortDFunctionDOWN) })
        )
        this.setState({ notDrag: true })
        break
      }
      case 'all': {
        this.setState({ namefilter: 'id' }, () =>
          this.setState({ tasks: arr.sort(this.sortDFunctionDOWN) })
        )
        break
      }
      default:
        break
    }
    if (
      (this.state.filterOption === 'all') &
      (this.state.filterSort === 'all')
    ) {
      this.setState({ notDrag: false })
    }
  }

  // Search by tasks
  searchText = e => {
    const ptext = e.target.value.toLowerCase().trim()
    const self = this
    if (ptext.length > 0) {
      localForage.getItem('arr_save').then(farr => {
        farr = farr.filter((item, i) => {
          if (item['text'].toLowerCase().search(ptext) !== -1) {
            return true
          } else {
            return false
          }
        })
        self.setState({ tasks: farr })
      })
      this.setState({ notDrag: true })
    } else {
      localForage.getItem('arr_save').then(farr => {
        self.setState({ tasks: farr }, () => self.filterTask())
      })
      this.setState({ notDrag: false })
    }
  }

  // Set filter value: "Все" - all, "Выполненные задание" - vip, "Не выполненные задания" - novip
  setFilterOption = e => {
    this.setState({ filterOption: e.target.value }, () => {
      this.filterTask()
      //() => {this.filterTask(), () => this.sortTask()}
    })
  }

  // Filter tasks by set value
  filterTask = () => {
    const self = this
    switch (this.state.filterOption) {
      case 'vip': {
        localForage.getItem('arr_save').then(farr => {
          farr = farr.filter((item, i) => {
            if (item['status']) {
              return true
            } else {
              return false
            }
          })
          self.setState({ tasks: farr }, () => self.sortTask())
        })
        this.setState({ notDrag: true })
        break
      }
      case 'novip': {
        localForage.getItem('arr_save').then(farr => {
          farr = farr.filter((item, i) => {
            if (item['status'] === false) {
              return true
            } else {
              return false
            }
          })
          self.setState({ tasks: farr }, () => self.sortTask())
        })
        this.setState({ notDrag: true })
        break
      }
      case 'all': {
        localForage.getItem('arr_save').then(farr => {
          self.setState({ tasks: farr }, () => self.sortTask())
        })
        break
      }
      default:
        break
    }
  }

  updateId = () => {
    var arr = this.state.tasks
    arr.forEach((item, i) => {
      item.id = i;
    })
    this.setState({ tasks: arr })
    localForage.setItem('arr_save', arr)
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      tasks: arrayMove(this.state.tasks, oldIndex, newIndex),
    })
    this.updateId()
  }

  handleNotDrag = e => {
    this.setState({ notDrag: e })
  }

  render() {
    return (
      <div>
        <Table>
          <tbody>
            <tr>
              <Td FirstCol>
                <Label>Поиск: </Label>
              </Td>
              <Td>
                <InputSearch
                  placeholder="Введите текст"
                  type="search"
                  ref="pSearch"
                  id="pSearch"
                  onChange={this.searchText}
                />
              </Td>
            </tr>
            <tr>
              <Td FirstCol>
                <Label>Фильтр: </Label>
              </Td>
              <Td>
                <input
                  ref="all"
                  type="radio"
                  name="filterOption"
                  value="all"
                  onChange={this.setFilterOption}
                  defaultChecked={true}
                />
                <Label>Все </Label>
                <input
                  ref="vip"
                  type="radio"
                  name="filterOption"
                  value="vip"
                  onChange={this.setFilterOption}
                />
                <Label>Выполнено </Label>
                <input
                  ref="novip"
                  type="radio"
                  name="filterOption"
                  value="novip"
                  onChange={this.setFilterOption}
                />
                <Label>Не выполнено </Label>
              </Td>
            </tr>
            <tr>
              <Td FirstCol>
                <Label>Сортировка: </Label>
              </Td>
              <Td>
                <select
                  ref="pSort"
                  id="pSort"
                  value={this.state.filterSort}
                  onChange={this.setFilterSort}
                >
                  <option value="all">---</option>
                  <option value="dateUP">Дата (по возрастанию)</option>
                  <option value="dateDOWN">Дата (по убыванию)</option>
                  <option value="statusTrue">Статус: Выполнено</option>
                  <option value="statusFulse">Статус: Не выполнено</option>
                </select>
              </Td>
            </tr>
          </tbody>
        </Table>
        <br />
        <Button onClick={this.add}>Добавить задание</Button>
        <SortableList
          items={this.state.tasks}
          onSortEnd={this.onSortEnd}
          lockAxis="xy"
          useDragHandle={true}
          hideSortableGhost={true}
          updateText={this.updateText}
          deleteBlock={this.deleteBlock}
          updateCheck={this.updateCheck}
          updateDate={this.updateDate}
          shouldCancelStart={() => {
            return this.state.notDrag
          }}
          handleNotDrag={this.handleNotDrag}
        />
      </div>
    )
  }
}
export default Boxs
