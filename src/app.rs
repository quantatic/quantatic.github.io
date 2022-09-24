use yew::prelude::*;
use yew_router::prelude::*;

#[derive(Clone, PartialEq, Routable)]
enum Route {
    #[at("/")]
    Home,
    #[at("/gb")]
    Gameboy,
    #[at("/gba")]
    GameboyAdvance,
}

fn switch(route: &Route) -> Html {
    match route {
        Route::Home => html! { 
            <div>
                <p>{"Welcome Home!"}</p>
                <ul>
                    <li>
                        <Link<Route> to={Route::Gameboy}>{"Gameboy/Gameboy Color Emulator!"}</Link<Route>>
                    </li>
                    <li>
                        <a href={"/gba"}>{"Gameboy Advance Emulator!"}</a>
                    </li>
                </ul>
            </div>
        },
        Route::Gameboy => html! { <p>{"Welcome to Gameboy/Gameboy Color!" }</p> },
        Route::GameboyAdvance => html! { <p>{"Welcome to Gameboy Advance!" }</p> },
    }
}

#[function_component(Main)]
pub fn app() -> Html {
    html! {
        <BrowserRouter>
            <Switch<Route> render={Switch::render(switch)}/>
        </BrowserRouter>
    }
}
