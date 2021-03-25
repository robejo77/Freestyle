/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import { Component, DoCheck, EventEmitter, Input, IterableDiffers, OnChanges,
	Output, SimpleChange } from '@angular/core';

import { BasicList } from './basic-list';

export type compareFunction = (a:any, b:any) => number;

let nextId = 0;

@Component({
	selector: 'dual-list',
	styleUrls: [ './dual-list.component.css' ],
	templateUrl: './dual-list.component.html'
})

export class DualListComponent implements DoCheck, OnChanges {
	static AVAILABLE_LIST_NAME = 'available';
	static SLOT1_NAME = 'S1';
  static SLOT2_NAME = 'S2';
  static SLOT3_NAME = 'S3';
  static SLOT4_NAME = 'S4';
  static SLOT5_NAME = 'S5';
  static SLOT6_NAME = 'S6';
  static SLOT7_NAME = 'S7';
  static SLOT8_NAME = 'S8';


	static LTR = 'left-to-right';
	static RTL = 'right-to-left';

	static DEFAULT_FORMAT =
  { add: 'Assign', remove: 'Remove', all: 'All', none: 'None', direction: DualListComponent.LTR, draggable: true };

	@Input() id = `dual-list-${nextId++}`;
	@Input() key = '_id';
	@Input() display = '_name';
	@Input() height = '100px';
	@Input() filter = false;
	@Input() format = DualListComponent.DEFAULT_FORMAT;
	@Input() sort = false;
	@Input() compare:compareFunction;
	@Input() disabled = false;
	@Input() source:Array<any>;
	@Input() destination:Array<any>;
  @Input() presenter:any;
	@Output() destinationChange = new EventEmitter();

	available:BasicList;
	S1:BasicList;
	S2:BasicList;
  S3:BasicList;
	S4:BasicList;
	S5:BasicList;
	S6:BasicList;
	S7:BasicList;
	S8:BasicList;


	sourceDiffer:any;
	destinationDiffer:any;

	private sorter = (a:any, b:any) => { return (a._name < b._name) ? -1 : ((a._name > b._name) ? 1 : 0); };

	constructor(private differs:IterableDiffers) {
		this.available = new BasicList(DualListComponent.AVAILABLE_LIST_NAME);
		this.S1 = new BasicList(DualListComponent.SLOT1_NAME);
		this.S2 = new BasicList(DualListComponent.SLOT2_NAME);
		this.S3 = new BasicList(DualListComponent.SLOT3_NAME);
		this.S4 = new BasicList(DualListComponent.SLOT4_NAME);
		this.S5 = new BasicList(DualListComponent.SLOT5_NAME);
		this.S6 = new BasicList(DualListComponent.SLOT6_NAME);
		this.S7 = new BasicList(DualListComponent.SLOT7_NAME);
		this.S8 = new BasicList(DualListComponent.SLOT8_NAME);
	}

	ngOnChanges(changeRecord: {[key:string]:SimpleChange}) {
		if (changeRecord['filter']) {
			if (changeRecord['filter'].currentValue === false) {
				this.clearFilter(this.available);
				this.clearFilter(this.S1);
        this.clearFilter(this.S2);
        this.clearFilter(this.S3);
        this.clearFilter(this.S4);
        this.clearFilter(this.S5);
        this.clearFilter(this.S6);
        this.clearFilter(this.S7);
        this.clearFilter(this.S8);
			}
		}

		if (changeRecord['sort']) {
			if (changeRecord['sort'].currentValue === true && this.compare === undefined) {
				this.compare = this.sorter;
			} else if (changeRecord['sort'].currentValue === false) {
				this.compare = undefined;
			}
		}

		if (changeRecord['format']) {
			this.format = changeRecord['format'].currentValue;

			if (typeof(this.format.direction) === 'undefined') {
				this.format.direction = DualListComponent.LTR;
			}

			if (typeof(this.format.add) === 'undefined') {
				this.format.add = DualListComponent.DEFAULT_FORMAT.add;
			}

			if (typeof(this.format.remove) === 'undefined') {
				this.format.remove = DualListComponent.DEFAULT_FORMAT.remove;
			}

			if (typeof(this.format.all) === 'undefined') {
				this.format.all = DualListComponent.DEFAULT_FORMAT.all;
			}

			if (typeof(this.format.none) === 'undefined') {
				this.format.none = DualListComponent.DEFAULT_FORMAT.none;
			}

			if (typeof(this.format.draggable) === 'undefined') {
				this.format.draggable = DualListComponent.DEFAULT_FORMAT.draggable;
			}
		}

		if (changeRecord['source']) {

			this.available = new BasicList(DualListComponent.AVAILABLE_LIST_NAME);
			this.updatedSource();
			this.updatedDestination();
		}

		if (changeRecord['destination']) {
      this.S1 = new BasicList(DualListComponent.SLOT1_NAME);
      this.S2 = new BasicList(DualListComponent.SLOT2_NAME);
      this.S3 = new BasicList(DualListComponent.SLOT3_NAME);
      this.S4 = new BasicList(DualListComponent.SLOT4_NAME);
      this.S5 = new BasicList(DualListComponent.SLOT5_NAME);
      this.S6 = new BasicList(DualListComponent.SLOT6_NAME);
      this.S7 = new BasicList(DualListComponent.SLOT7_NAME);
      this.S8 = new BasicList(DualListComponent.SLOT8_NAME);
			this.updatedDestination();
			this.updatedSource();
		}
	}

	ngDoCheck() {
		if (this.source && this.buildAvailable(this.source)) {
			this.onFilter(this.available);
		}
		if (this.destination && this.buildConfirmed(this.destination)) {
			this.onFilter(this.S1);
      this.onFilter(this.S2);
      this.onFilter(this.S3);
      this.onFilter(this.S4);
      this.onFilter(this.S5);
      this.onFilter(this.S6);
      this.onFilter(this.S7);
      this.onFilter(this.S8);
		}

    if (this.available.pick.length > 1) {
      const lastPick = this.available.last
      console.log('stop'+ JSON.stringify(this.available.last) )
      this.available.pick.splice(0);

    }
	}

	buildAvailable(source:Array<any>) : boolean {
		const sourceChanges = this.sourceDiffer.diff(source);
		if (sourceChanges) {
			sourceChanges.forEachRemovedItem((r:any) => {
				const idx = this.findItemIndex(this.available.list, r.item, this.key);
				if (idx !== -1) {
					this.available.list.splice(idx, 1);
				}
			});

			sourceChanges.forEachAddedItem((r:any) => {
				// Do not add duplicates even if source has duplicates.
				if (this.findItemIndex(this.available.list, r.item, this.key) === -1) {
					this.available.list.push( { _id: this.makeId(r.item), _name: this.makeName(r.item) });
				}
			});

			if (this.compare !== undefined) {
				this.available.list.sort(this.compare);
			}
			this.available.sift = this.available.list;

			return true;
		}
		return false;
	}

	buildConfirmed(destination:Array<any>) : boolean {
		let moved = false;
		const destChanges = this.destinationDiffer.diff(destination);
		if (destChanges) {
			destChanges.forEachRemovedItem((r:any) => {
				const idx = this.findItemIndex(this.S1.list, r.item, this.key);
				if (idx !== -1) {
					if (!this.isItemSelected(this.S1.pick, this.S1.list[idx])) {
						this.selectItem(this.S1.pick, this.S1.list[idx]);
					}
					this.moveItem(this.S1, this.available, this.S1.list[idx], false);
					moved = true;
				}
			});

			destChanges.forEachAddedItem((r:any) => {
				const idx = this.findItemIndex(this.available.list, r.item, this.key);
				if (idx !== -1) {
					if (!this.isItemSelected(this.available.pick, this.available.list[idx])) {
						this.selectItem(this.available.pick, this.available.list[idx]);
					}
					this.moveItem(this.available, this.S1, this.available.list[idx], false);
					moved = true;
				}
			});

			if (this.compare !== undefined) {
				this.S1.list.sort(this.compare);
			}
			this.S1.sift = this.S1.list;

			if (moved) {
				this.trueUp();
			}
			return true;
		}
		return false;
	}
	buildS2(destination:Array<any>) : boolean {
		let moved = false;
		const destChanges = this.destinationDiffer.diff(destination);
		if (destChanges) {
			destChanges.forEachRemovedItem((r:any) => {
				const idx = this.findItemIndex(this.S2.list, r.item, this.key);
				if (idx !== -1) {
					if (!this.isItemSelected(this.S2.pick, this.S2.list[idx])) {
						this.selectItem(this.S2.pick, this.S2.list[idx]);
					}
					this.moveItem(this.S2, this.available, this.S2.list[idx], false);
					moved = true;
				}
			});

			destChanges.forEachAddedItem((r:any) => {
				const idx = this.findItemIndex(this.available.list, r.item, this.key);
				if (idx !== -1) {
					if (!this.isItemSelected(this.available.pick, this.available.list[idx])) {
						this.selectItem(this.available.pick, this.available.list[idx]);
					}
					this.moveItem(this.available, this.S2, this.available.list[idx], false);
					moved = true;
				}
			});

			if (this.compare !== undefined) {
				this.S2.list.sort(this.compare);
			}
			this.S2.sift = this.S2.list;

			if (moved) {
				this.trueUp();
			}
			return true;
		}
		return false;
	}
	updatedSource() {
		this.available.list.length = 0;
		this.available.pick.length = 0;


		if (this.source !== undefined) {
			this.sourceDiffer = this.differs.find(this.source).create(null);
		}
	}

	updatedDestination() {
		if (this.destination !== undefined) {
			this.destinationDiffer = this.differs.find(this.destination).create(null);
		}
	}

	direction() {
		return this.format.direction === DualListComponent.LTR;
	}

	// dragEnd(list:BasicList = null) {
	// 	if (list) {
	// 		list.dragStart = false;
	// 	} else {
	// 		this.available.dragStart = false;
	// 		this.confirmed.dragStart = false;
  //     this.confirmed1.dragStart = false;
	// 	}
	// 	return false;
	// }

	// drag(event:DragEvent, item:any, list:BasicList) {
	// 	if (!this.isItemSelected(list.pick, item)) {
	// 		this.selectItem(list.pick, item);
	// 	}
	// 	list.dragStart = true;

	// 	// Set a custom type to be this dual-list's id.
	// 	event.dataTransfer.setData(this.id, item['_id']);
	// }

	// allowDrop(event:DragEvent, list:BasicList) {
	// 	if (event.dataTransfer.types.length && (event.dataTransfer.types[0] === this.id)) {
	// 		event.preventDefault();
	// 		if (!list.dragStart) {
	// 			list.dragOver = true;
	// 		}
	// 	}
	// 	return false;
	// }

	// dragLeave() {
	// 	this.available.dragOver = false;
	// 	this.confirmed.dragOver = false;
	// 	this.confirmed1.dragOver = false;
	// }

	// drop(event:DragEvent, list:BasicList) {
	// 	if (event.dataTransfer.types.length && (event.dataTransfer.types[0] === this.id)) {
	// 		event.preventDefault();
	// 		this.dragLeave();
	// 		this.dragEnd();

	// 		if (list === this.available) {
	// 			this.moveItem(this.available, this.confirmed);
  //       this.moveItem(this.available, this.confirmed1);
	// 		} else {
	// 			this.moveItem(this.confirmed, this.available);
	// 			this.moveItem(this.confirmed1, this.available);
	// 		}
	// 	}
	// }

	private trueUp() {
		let changed = false;

		// Clear removed items.
		let pos = this.destination.length;
		while ((pos -= 1) >= 0) {
			const mv = this.S1.list.filter( conf => {
				if (typeof this.destination[pos] === 'object') {
					return conf._id === this.destination[pos][this.key];
				} else {
					return conf._id === this.destination[pos];
				}
			});
			if (mv.length === 0) {
				// Not found so remove.
				this.destination.splice(pos, 1);
				changed = true;
			}
		}


		// Push added items.
		for (let i = 0, len = this.S1.list.length; i < len; i += 1) {
			let mv = this.destination.filter( (d:any) => {
				if (typeof d === 'object') {
					return (d[this.key] === this.S1.list[i]._id);
				} else {
					return (d === this.S1.list[i]._id);
				}
			});

			if (mv.length === 0) {
				// Not found so add.
				mv = this.source.filter( (o:any) => {
					if (typeof o === 'object') {
						return (o[this.key] === this.S1.list[i]._id);
					} else {
						return (o === this.S1.list[i]._id);
					}
				});

				if (mv.length > 0) {
					this.destination.push(mv[0]);
					changed = true;
				}
			}
		}

		if (changed) {
			this.destinationChange.emit(this.destination);
		}
	}

	findItemIndex(list:Array<any>, item:any, key:any = '_id') {
		let idx = -1;

		function matchObject(e:any) {
			if (e._id === item[key]) {
				idx = list.indexOf(e);
				return true;
			}
			return false;
		}

		function match(e:any) {
			if (e._id === item) {
				idx = list.indexOf(e);
				return true;
			}
			return false;
		}

		// Assumption is that the arrays do not have duplicates.
		if (typeof item === 'object') {
			list.filter(matchObject);
		} else {
			list.filter(match);
		}

		return idx;
	}

	private makeUnavailable(source:BasicList, item:any) {
		const idx = source.list.indexOf(item);
		if (idx !== -1) {
			source.list.splice(idx, 1);
		}
	}

	moveItem(source:BasicList, target:BasicList, item:any = null, trueup = true) {
		let i = 0;
		let len = source.pick.length;

		if (item) {
			i = source.list.indexOf(item);
			len = i + 1;
		}

		for (; i < len; i += 1) {
			// Is the pick still in list?
			let mv:Array<any> = [];
			if (item) {
				const idx = this.findItemIndex(source.pick, item);
				if (idx !== -1) {
					mv[0] = source.pick[idx];
				}
			} else {
				mv = source.list.filter( src => {
					return (src._id === source.pick[i]._id);
				});
			}

			// Should only ever be 1
			if (mv.length === 1) {
				// Add if not already in target.
				if (target.list.filter(trg => trg._id === mv[0]._id).length === 0) {
					target.list.push( mv[0] );
				}

				this.makeUnavailable(source, mv[0]);
			}
		}

		if (this.compare !== undefined) {
			target.list.sort(this.compare);
		}

		source.pick.length = 0;

		// Update destination
		if (trueup) {
			this.trueUp();
		}

		// Delay ever-so-slightly to prevent race condition.
		setTimeout( () => {
			this.onFilter(source);
			this.onFilter(target);
		}, 10);
	}

	isItemSelected(list:Array<any>, item:any) {
		if (list.filter(e => Object.is(e, item)).length > 0) {
			return true;
		}
		return false;
	}

	shiftClick(event:MouseEvent, index:number, source:BasicList, item:any) {
		if (event.shiftKey && source.last && !Object.is(item, source.last)) {
			const idx = source.sift.indexOf(source.last);
			if (index > idx) {
				for (let i = (idx + 1); i < index; i += 1) {
					this.selectItem(source.pick, source.sift[i]);
				}
			} else if (idx !== -1) {
				for (let i = (index + 1); i < idx; i += 1)  {
					this.selectItem(source.pick, source.sift[i]);
				}
			}
		}
		source.last = item;
	}

	selectItem(list:Array<any>, item:any) {
		const pk = list.filter( (e:any) => {
			return Object.is(e, item);
		});
		if (pk.length > 0) {
			// Already in list, so deselect.
			for (let i = 0, len = pk.length; i < len; i += 1) {
				const idx = list.indexOf(pk[i]);
				if (idx !== -1) {
					list.splice(idx, 1);
				}
			}
		} else {
			list.push(item);
		}
	}

	selectAll(source:BasicList) {
		source.pick.length = 0;
		source.pick = source.sift.slice(0);
	}

	selectNone(source:BasicList) {
		source.pick.length = 0;
	}

	isAllSelected(source:BasicList) {
		if (source.list.length === 0 || source.list.length === source.pick.length) {
			return true;
		}
		return false;
	}

	isAnySelected(source:BasicList) {
		if (source.pick.length > 0) {
			return true;
		}
		return false;
	}

	private unpick(source:BasicList) {
		for (let i = source.pick.length - 1; i >= 0; i -= 1) {
			if (source.sift.indexOf(source.pick[i]) === -1) {
				source.pick.splice(i, 1);
			}
		}
	}

	clearFilter(source:BasicList) {
		if (source) {
			source.picker = '';
			this.onFilter(source);
		}
	}

	onFilter(source:BasicList) {
		if (source.picker.length > 0) {
			const filtered = source.list.filter( (item:any) => {
				if (Object.prototype.toString.call(item) === '[object Object]') {
					if (item._name !== undefined) {
						return item._name.toLowerCase().indexOf(source.picker.toLowerCase()) !== -1;
					} else {
						return JSON.stringify(item).toLowerCase().indexOf(source.picker.toLowerCase()) !== -1;
					}
				} else {
					return item.toLowerCase().indexOf(source.picker.toLowerCase()) !== -1;
				}
			});
			source.sift = filtered;
			this.unpick(source);
		} else {
			source.sift = source.list;
		}
	}

	private makeId(item:any) : string | number {
		if (typeof item === 'object') {
			return item[this.key];
		} else {
			return item;
		}
	}

	// Allow for complex names by passing an array of strings.
	// Example: [display]="[ '_type.substring(0,1)', '_name' ]"
	private makeName(item:any) : string {
		const display = this.display;

		function fallback(itm:any) {
			switch (Object.prototype.toString.call(itm)) {
			case '[object Number]':
				return itm;
			case '[object String]':
				return itm;
			default:
				if (itm !== undefined) {
					return itm[display];
				} else {
					return 'undefined';
				}
			}
		}

		let str = '';

		if (this.display !== undefined) {
			if (Object.prototype.toString.call( this.display ) === '[object Array]' ) {

				for (let i = 0; i < this.display.length; i += 1) {
					if (str.length > 0) {
						str = str + '_';
					}

					if (this.display[i].indexOf('.') === -1) {
						// Simple, just add to string.
						str = str + item[this.display[i]];

					} else {
						// Complex, some action needs to be performed
						const parts = this.display[i].split('.');

						const s = item[parts[0]];
						if (s) {
							// Use brute force
							if (parts[1].indexOf('substring') !== -1) {
								const nums = (parts[1].substring(parts[1].indexOf('(') + 1, parts[1].indexOf(')'))).split(',');

								switch (nums.length) {
								case 1:
									str = str + s.substring(parseInt(nums[0], 10));
									break;
								case 2:
									str = str + s.substring(parseInt(nums[0], 10), parseInt(nums[1], 10));
									break;
								default:
									str = str + s;
									break;
								}
							} else {
								// method not approved, so just add s.
								str = str + s;
							}
						}
					}
				}
				return str;
			} else {
				return fallback(item);
			}
		}

		return fallback(item);
	}
}
