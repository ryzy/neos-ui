import {createAction} from 'redux-actions';
import {Map, Set} from 'immutable';
import {$all, $set, $remove, $add} from 'plow-js';

const FOCUS = '@neos/neos-ui/UI/PageTree/FOCUS';
const COMMENCE_UNCOLLAPSE = '@neos/neos-ui/UI/PageTree/COMMENCE_UNCOLLAPSE';
const UNCOLLAPSE = '@neos/neos-ui/UI/PageTree/UNCOLLAPSE';
const COLLAPSE = '@neos/neos-ui/UI/PageTree/COLLAPSE';
const TOGGLE = '@neos/neos-ui/UI/PageTree/TOGGLE';
const INVALIDATE = '@neos/neos-ui/UI/PageTree/INVALIDATE';
const REQUEST_CHILDREN = '@neos/neos-ui/UI/PageTree/REQUEST_CHILDREN';

//
// Export the action types
//
export const actionTypes = {
    FOCUS,
    COMMENCE_UNCOLLAPSE,
    UNCOLLAPSE,
    COLLAPSE,
    TOGGLE,
    INVALIDATE,
    REQUEST_CHILDREN
};

const focus = createAction(FOCUS, contextPath => ({contextPath}));
const commenceUncollapse = createAction(COMMENCE_UNCOLLAPSE, contextPath => ({contextPath}));
const uncollapse = createAction(UNCOLLAPSE, contextPath => ({contextPath}));
const collapse = createAction(COLLAPSE, contextPath => ({contextPath}));
const toggle = createAction(TOGGLE, contextPath => ({contextPath}));
const invalidate = createAction(INVALIDATE, contextPath => ({contextPath}));
const requestChildren = createAction(REQUEST_CHILDREN, contextPath => ({contextPath}));

//
// Export the actions
//
export const actions = {
    focus,
    commenceUncollapse,
    uncollapse,
    collapse,
    toggle,
    invalidate,
    requestChildren
};

//
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'ui.pageTree',
    new Map({
        focused: '',
        uncollapsed: new Set(),
        loading: new Set(),
        errors: new Set()
    })
);

//
// Export the reducer
//
export const reducer = {
    [FOCUS]: ({contextPath}) => $set('ui.pageTree.focused', contextPath),
    [UNCOLLAPSE]: ({contextPath}) => $all(
        $remove('ui.pageTree.errors', contextPath),
        $remove('ui.pageTree.loading', contextPath),
        $add('ui.pageTree.uncollapsed', contextPath)
    ),
    [COLLAPSE]: ({contextPath}) => $all(
        $remove('ui.pageTree.errors', contextPath),
        $remove('ui.pageTree.loading', contextPath),
        $remove('ui.pageTree.uncollapsed', contextPath)
    ),
    [INVALIDATE]: ({contextPath}) => $all(
        $remove('ui.pageTree.uncollapsed', contextPath),
        $remove('ui.pageTree.loading', contextPath),
        $add('ui.pageTree.errors', contextPath)
    ),
    [REQUEST_CHILDREN]: ({contextPath}) => $all(
        $remove('ui.pageTree.uncollapsed', contextPath),
        $remove('ui.pageTree.errors', contextPath),
        $add('ui.pageTree.loading', contextPath)
    )
};
