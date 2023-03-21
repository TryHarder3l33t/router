import {
  Outlet,
  useLoaderData,
  Form,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
  useParams,
} from 'react-router-dom';
import { getContacts, createContact } from '../contacts';
import { useEffect } from 'react';

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  // q is returned to be the default state
  // contacts and q is available to your
  // html through useLoaderData()
  console.log(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  // The navigation.location will show up when the app is
  // navigating to a new URL and loading the data for it.It
  // then goes away when there is no pending navigation anymore.
  // This says searching is true if there is navigating going
  // on and the form is doing a search it will have a ? q =
  // console.log(navigation.location) ->
  // { pathname: '/', search: '?q=', hash: '', state: null, key: '0j1i3sap' }
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    document.getElementById('q').value = q;
  }, [q]);

  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>
        <div>
          {/* 
          Because this is a GET, not a POST, React Router does not
          call the action. Submitting a GET form is the same as clicking
          a link: only the URL changes. That's why the code we added
          for filtering is in the loader, not the action of this route.
          This also means it's a normal page navigation. You can click
          the back button to get back to where you were. 
          */}
          <Form id='search-form' role='search'>
            {/* 
            The name of this input is q, that's why the
            URL has ?q=. If we named it search the URL
            would be ?search=. This is serialization 
            (The process whereby an object or data 
            structure is translated into a format 
            suitable for transfer over a network) 
            browsers can serialize forms by the name 
            attribute of it's input elements. 
            */}
            <input
              id='q'
              className={searching ? 'loading' : ''}
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='q'
              defaultValue={q}
              // This is submitting the entire form vs just the
              // event.target.value this is the equivalent of
              // submitting the form
              // The submit function will serialize and submit any
              // form you pass to it.
              onChange={(event) => {
                const isFirstSearch = q == null;
                // We only want to replace search results, not the page
                // before we started searching, so we do a quick check if
                // this is the first search or not and then decide to replace.
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id='search-spinner' aria-hidden hidden={!searching} />
            <div className='sr-only' aria-live='polite'></div>
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id='detail'
        className={navigation.state === 'loading' ? 'loading' : ''}
      ></div>
      <Outlet />
    </>
  );
}
