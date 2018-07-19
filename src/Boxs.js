import React from 'react';
//import localForage from 'localforage/dist/localforage';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => {
  return(
    <span>
      <img src="drag-reorder.png" alt='Drag-list' />
    </span>
  )});

const SortableItem = SortableElement(({value, status, date}) => (
    <div className="box">{value}
        <hr />
        <input type="checkbox" defaultChecked={status} />
        <p className={status ? 'pstate_gr' : 'pstate_red'}>Статус: {status ? 'Выполнено' : 'Не выполнено'}</p>
        <label>Дата выполнения: </label>
        <input type='date' defaultValue={date} readonly="readonly" />
        <hr />< DragHandle/>
    </div>
    )
);
                                     
const SortableList = SortableContainer(({items}) => {
    return (
      <div className="container">
        {items.map((item, index) => {
          return <SortableItem key={`item-${index}`+Math.floor((Math.random()*1000)).toString()} index={index} value={item.text} date={item.date} status={item.status} />;
        })}
      </div>
    );
});



class Boxs extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
        list: []
    }
  }
  
  componentDidMount() {
    var arr = this.props.tList;
    this.setState({ list: arr });
    /*
    const self = this;
    localforage.getItem('arr_save', function (err, farr) {
      if (farr == null) {
        farr = [];
      }
      //var arr = farr.map(function(item) {
      //  return (item.text);
      //});
      self.setState({ list: farr });
    });
    */
  }
  SavePriority = () => {
    this.props.SetTaskPriority(this.state.list);
  };


  onSortEnd({oldIndex, newIndex}) {
    this.setState({
      list: arrayMove(this.state.list, oldIndex, newIndex)
    });
    this.SavePriority();
   // var arr = this.state.list;
   // localforage.setItem('arr_save', arr);
  }
  // useDragHandle = {true}
  render() {
    //const self = this;
   // onSortEnd={({oldIndex, newIndex, collection}, e) => (self.props.arrMove(oldIndex, newIndex))}
    return (
      <div>
        <SortableList items={this.state.list} onSortEnd={this.onSortEnd.bind(this)} axis='xy' useDragHandle = {true} />
      </div>
    );
  }
};
export default Boxs;