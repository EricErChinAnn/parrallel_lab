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

const createProductForm = (media_properties, tags) =>{
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
        }),
        "tags":fields.string({
            label: "Tags",
            required:true,
            errorAfterField:true,
            cssClasses:{
                label:("form-label")
            },
            widget: widgets.multipleSelect(),
            choices: tags
        }),
        "image_url":fields.string({
            label: "Image",
            widget:widgets.hidden()
        })
    })
}

const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
} 

const createLoginForm = ()=>{
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
    })
}

const createSearchForm = (media_properties , tags)=>{
    return forms.create({
        "title": fields.string({
            required:false,
            errorAfterField:true,
            cssClasses:{
                label:["form-label"]
            }
        }),
        "min_cost":fields.number({
            label:"Min Cost (in Cents)",
            required:false,
            errorAfterField:true,
            validators:[validators.integer()],
            widget:widgets.number(),
            cssClasses:{
                label:["form-label"]
            }
        }),
        "max_cost":fields.number({
            label:"Max Cost (in Cents)",
            required:false,
            errorAfterField:true,
            validators:[validators.integer()],
            widget:widgets.number(),
            cssClasses:{
                label:["form-label"]
            }
        }),
        "media_property_id":fields.string({
            label: 'Media Properties',
            required: false,
            widget: widgets.select(),
            choices: media_properties
        }),
        "tags":fields.string({
            required: false,
            errorAfterField:true,
            widget: widgets.multipleSelect(),
            choices: tags
        }),
        "min_height":fields.number({
            label:"Min Height (in CM)",
            required:false,
            errorAfterField:true,
            validators:[validators.integer()],
            widget:widgets.number(),
            cssClasses:{
                label:["form-label"]
            }
        }),
        "max_height":fields.number({
            label:"Max Height (in CM)",
            required:false,
            errorAfterField:true,
            validators:[validators.integer()],
            widget:widgets.number(),
            cssClasses:{
                label:["form-label"]
            }
        }),
        "min_width":fields.number({
            label:"Min Width (in CM)",
            required:false,
            errorAfterField:true,
            validators:[validators.integer()],
            widget:widgets.number(),
            cssClasses:{
                label:["form-label"]
            }
        }),
        "max_width ":fields.number({
            label:"Max Width (in CM)",
            required:false,
            errorAfterField:true,
            validators:[validators.integer()],
            widget:widgets.number(),
            cssClasses:{
                label:["form-label"]
            }
        })
    }) 
}

module.exports = { 
    createProductForm , 
    bootstrapField , 
    createRegistrationForm,
    createLoginForm,
    createSearchForm
};