import { Moment } from './constructor';
import { get, set } from './get-set';
import { setMonth } from '../units/month';
import { createDuration } from '../duration/create';
import { deprecateSimple } from '../utils/deprecate';
import { hooks } from '../utils/hooks';
import absRound from '../utils/abs-round';


// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        return addSubtract(this, dur, direction);
    };
}

export function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom = new Moment(mom);
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        mom = set(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        mom = setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        mom = hooks.updateOffset(mom, days || months);
    }
    return mom;
}

export var add      = createAdder(1, 'add');
export var subtract = createAdder(-1, 'subtract');
