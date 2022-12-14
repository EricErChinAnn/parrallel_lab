const forms = require("forms");

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

let bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (media_properties=[]) =>{
    return forms.create({
        "title":fields.string({
            required:true,
            errorAfterField:true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        "cost":fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer()],
            cssClasses: {
                label: ['form-label']
            }
        }),
        "description":fields.string({
            required:true,
            errorAfterField:true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        "date":fields.date({
            errorAfterField:true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        "stock":fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer()],
            cssClasses: {
                label: ['form-label']
            }
        }),
        "height":fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer()],
            cssClasses: {
                label: ['form-label']
            }
        }),
        "width":fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer()],
            cssClasses: {
                label: ['form-label']
            }
        }),
        "media_property_id":fields.number({
            label:"Media Property",
            required:true,
            errorAfterField:true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: media_properties
        })
    })
}



module.exports = { createProductForm , bootstrapField };