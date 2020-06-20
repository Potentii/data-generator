import fs from 'fs'
import EventEmitter from 'events'



export default class Writer{
	
	constructor(){
		this._ee = new EventEmitter();
	}
	
	dataProvider(fn){
		this._data_provider = fn;
		return this;
	}

	startingProvider(fn){
		this._starting_provider = fn;
		return this;
	}

	endingProvider(fn){
		this._ending_provider = fn;
		return this;
	}
	
	onProgress(fn){
		this._ee.on('progress', fn);
		return this;
	}


	/**
	 * 
	 * @param {String} file The path to the new file
	 * @param {Number} entries The number of entries to be written
	 * @return {Promise<void>}
	 */
	async write(file, entries){
		if(typeof file != 'string' || !file.trim())
			throw new TypeError(`Invalid file name "${file}"`);
		if(Number.isNaN(Number(entries)) || entries <= 0)
			throw new TypeError(`Invalid number of entries "${entries}"`);
		
		return new Promise((resolve, reject) => {
			try{
				// *File write stream:
				const writable = fs.createWriteStream(file);
				writable.on('error', err => reject(err));
				writable.on('open', fd => {
					try{
						bulkWrite(entries, writable, this._data_provider, this._starting_provider, this._ending_provider, this._ee, 'utf-8', () => resolve());
					} catch(err){
						reject(err);
					}
				});
			} catch(err){
				reject(err);
			}
		});
	}
	
}


/**
 * 
 * @param {Number} qty
 * @param {WriteStream} writable
 * @param {Function} data_gen
 * @param {Function} starting_gen
 * @param {Function} ending_gen
 * @param {EventEmitter} ee
 * @param {String} encoding
 * @param {Function} cb
 */
function bulkWrite(qty, writable, data_gen, starting_gen, ending_gen, ee, encoding = 'utf-8', cb) {
	const has_starting_gen = typeof starting_gen == 'function';
	const has_ending_gen = typeof ending_gen == 'function';
	const has_data_gen = typeof data_gen == 'function';
	
	if(!has_data_gen)
		throw new Error(`The data provider function must be set`);

	const progress_notification_step = 10000;
	
	let i = qty;
	let real_i = 0;
	
	if(has_starting_gen)
		writable.write(starting_gen.call(this), encoding);
	
	_write();
	function _write() {
		let ok = true;
		do {
			real_i = (qty-i);
			i--;
			if(!(i%progress_notification_step)){
				const progress = real_i/qty;
				ee.emit('progress', progress);
			}
			if (i === 0) {
				// *If it's the last entry:
				if(has_ending_gen){
					writable.write(data_gen.call(this, real_i, true), encoding);
					writable.write(ending_gen.call(this), encoding, cb);
				} else{
					writable.write(data_gen.call(this, real_i, true), encoding, cb);
				}
				writable.end();
			} else {
				// *If it's NOT the last entry yet:
				ok = writable.write(data_gen.call(this, real_i, false), encoding);
			}
		} while (i > 0 && ok);
		if (i > 0) {
			// *If it needs to drain:
			writable.once('drain', _write);
		}
	}
}